using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.API.DTOs.Product;
using POS.API.Models;

namespace POS.API.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductResponseDto>> GetAllAsync(int tenantId)
        {
            return await _context.Products
                .Where(p => p.TenantId == tenantId)
                .Include(p => p.Category)
                .Include(p => p.ProductSuppliers)
                    .ThenInclude(ps => ps.Supplier)
                .Select(p => new ProductResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Barcode = p.Barcode,
                    Price = p.Price,
                    Stock = p.Stock,
                    CategoryName = p.Category != null ? p.Category.Name : null,
                    SupplierNames = p.ProductSuppliers
                        .Select(ps => ps.Supplier.Name)
                        .ToList()
                })
                .ToListAsync();
        }

        public async Task<ProductResponseDto?> GetByIdAsync(int tenantId, int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductSuppliers)
                    .ThenInclude(ps => ps.Supplier)
                .FirstOrDefaultAsync(p => p.TenantId == tenantId && p.Id == id);

            if (product == null) return null;

            return new ProductResponseDto
            {
                Id = product.Id,
                Name = product.Name,
                Barcode = product.Barcode,
                Price = product.Price,
                Stock = product.Stock,
                CategoryName = product.Category?.Name,
                SupplierNames = product.ProductSuppliers
                    .Select(ps => ps.Supplier.Name)
                    .ToList()
            };
        }

        public async Task<ProductResponseDto> CreateAsync(int tenantId, CreateProductDto dto)
        {
            var product = new Product
            {
                TenantId = tenantId,
                CategoryId = dto.CategoryId,
                Name = dto.Name,
                Barcode = dto.Barcode,
                Price = dto.Price,
                Stock = dto.Stock
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Link suppliers through the junction table
            foreach (var supplierId in dto.SupplierIds)
            {
                _context.ProductSuppliers.Add(new ProductSupplier
                {
                    ProductId = product.Id,
                    SupplierId = supplierId
                });
            }
            await _context.SaveChangesAsync();

            return await GetByIdAsync(tenantId, product.Id) ?? throw new Exception("Failed to retrieve created product.");
        }

        public async Task<ProductResponseDto?> UpdateAsync(int tenantId, int id, UpdateProductDto dto)
        {
            var product = await _context.Products
                .Include(p => p.ProductSuppliers)
                .FirstOrDefaultAsync(p => p.TenantId == tenantId && p.Id == id);

            if (product == null) return null;

            product.Name = dto.Name;
            product.Barcode = dto.Barcode;
            product.Price = dto.Price;
            product.Stock = dto.Stock;
            product.CategoryId = dto.CategoryId;

            // Remove all existing supplier links
            _context.ProductSuppliers.RemoveRange(product.ProductSuppliers);

            // Add the new supplier links
            foreach (var supplierId in dto.SupplierIds)
            {
                _context.ProductSuppliers.Add(new ProductSupplier
                {
                    ProductId = product.Id,
                    SupplierId = supplierId
                });
            }

            await _context.SaveChangesAsync();

            return await GetByIdAsync(tenantId, product.Id);
        }

        public async Task<bool> DeleteAsync(int tenantId, int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.TenantId == tenantId && p.Id == id);

            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}