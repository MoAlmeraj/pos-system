using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.API.DTOs.Sale;
using POS.API.Models;

namespace POS.API.Services
{
    public class SaleService : ISaleService
    {
        private readonly AppDbContext _context;

        public SaleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<SaleResponseDto>> GetAllAsync(int tenantId)
        {
            return await _context.Sales
                .Where(s => s.TenantId == tenantId)
                .Include(s => s.Customer)
                .Include(s => s.SaleItems)
                    .ThenInclude(si => si.Product)
                .Select(s => new SaleResponseDto
                {
                    Id = s.Id,
                    CustomerName = s.Customer != null ? s.Customer.Name : null,
                    SaleDate = s.SaleDate,
                    Total = s.Total,
                    PaymentMethod = s.PaymentMethod,
                    Items = s.SaleItems.Select(si => new SaleItemResponseDto
                    {
                        ProductName = si.Product.Name,
                        Quantity = si.Quantity,
                        UnitPrice = si.UnitPrice,
                        Subtotal = si.Subtotal
                    }).ToList()
                })
                .ToListAsync();
        }

        public async Task<SaleResponseDto?> GetByIdAsync(int tenantId, int id)
        {
            var sale = await _context.Sales
                .Include(s => s.Customer)
                .Include(s => s.SaleItems)
                    .ThenInclude(si => si.Product)
                .FirstOrDefaultAsync(s => s.TenantId == tenantId && s.Id == id);

            if (sale == null) return null;

            return new SaleResponseDto
            {
                Id = sale.Id,
                CustomerName = sale.Customer?.Name,
                SaleDate = sale.SaleDate,
                Total = sale.Total,
                PaymentMethod = sale.PaymentMethod,
                Items = sale.SaleItems.Select(si => new SaleItemResponseDto
                {
                    ProductName = si.Product.Name,
                    Quantity = si.Quantity,
                    UnitPrice = si.UnitPrice,
                    Subtotal = si.Subtotal
                }).ToList()
            };
        }

        public async Task<SaleResponseDto> CreateAsync(int tenantId, CreateSaleDto dto)
        {
            // Step 1: Validate customer if provided
            if (dto.CustomerId.HasValue)
            {
                var customerExists = await _context.Customers
                    .AnyAsync(c => c.TenantId == tenantId && c.Id == dto.CustomerId.Value);
                if (!customerExists)
                    throw new Exception("Customer not found.");
            }

            // Step 2: Validate products and build sale items
            var saleItems = new List<SaleItem>();
            decimal total = 0;

            foreach (var itemDto in dto.Items)
            {
                var product = await _context.Products
                    .FirstOrDefaultAsync(p => p.TenantId == tenantId && p.Id == itemDto.ProductId);

                if (product == null)
                    throw new Exception($"Product with Id {itemDto.ProductId} not found.");

                if (product.Stock < itemDto.Quantity)
                    throw new Exception($"Insufficient stock for product '{product.Name}'. Available: {product.Stock}, Requested: {itemDto.Quantity}.");

                var subtotal = product.Price * itemDto.Quantity;
                total += subtotal;

                saleItems.Add(new SaleItem
                {
                    ProductId = product.Id,
                    Quantity = itemDto.Quantity,
                    UnitPrice = product.Price,
                    Subtotal = subtotal
                });

                // Deduct stock
                product.Stock -= itemDto.Quantity;
            }

            // Step 3: Create the sale
            var sale = new Sale
            {
                TenantId = tenantId,
                CustomerId = dto.CustomerId,
                SaleDate = DateTime.UtcNow,
                Total = total,
                PaymentMethod = dto.PaymentMethod
            };

            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            // Step 4: Attach sale items to the sale
            // Step 4: Attach sale items to the sale
            foreach (var item in saleItems)
            {
                item.SaleId = sale.Id;
                _context.SaleItems.Add(item);
            }

            // Step 5: If payment is Credit, deduct total from customer balance
            if (dto.PaymentMethod == "Credit" && dto.CustomerId.HasValue)
            {
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.TenantId == tenantId && c.Id == dto.CustomerId.Value);
                if (customer != null)
                {
                    customer.Balance -= total;
                }
            }

            await _context.SaveChangesAsync();

            await _context.SaveChangesAsync();

            return await GetByIdAsync(tenantId, sale.Id)
                ?? throw new Exception("Failed to retrieve created sale.");
        }
    }
}