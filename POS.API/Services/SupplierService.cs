using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.API.DTOs.Supplier;
using POS.API.Models;

namespace POS.API.Services
{
    public class SupplierService : ISupplierService
    {
        private readonly AppDbContext _context;

        public SupplierService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<SupplierResponseDto>> GetAllAsync(int tenantId)
        {
            return await _context.Suppliers
                .Where(s => s.TenantId == tenantId)
                .Select(s => new SupplierResponseDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Phone = s.Phone,
                    Email = s.Email
                })
                .ToListAsync();
        }

        public async Task<SupplierResponseDto?> GetByIdAsync(int tenantId, int id)
        {
            var supplier = await _context.Suppliers
                .FirstOrDefaultAsync(s => s.TenantId == tenantId && s.Id == id);

            if (supplier == null) return null;

            return new SupplierResponseDto
            {
                Id = supplier.Id,
                Name = supplier.Name,
                Phone = supplier.Phone,
                Email = supplier.Email
            };
        }

        public async Task<SupplierResponseDto> CreateAsync(int tenantId, CreateSupplierDto dto)
        {
            var supplier = new Supplier
            {
                TenantId = tenantId,
                Name = dto.Name,
                Phone = dto.Phone,
                Email = dto.Email
            };

            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();

            return new SupplierResponseDto
            {
                Id = supplier.Id,
                Name = supplier.Name,
                Phone = supplier.Phone,
                Email = supplier.Email
            };
        }

        public async Task<SupplierResponseDto?> UpdateAsync(int tenantId, int id, UpdateSupplierDto dto)
        {
            var supplier = await _context.Suppliers
                .FirstOrDefaultAsync(s => s.TenantId == tenantId && s.Id == id);

            if (supplier == null) return null;

            supplier.Name = dto.Name;
            supplier.Phone = dto.Phone;
            supplier.Email = dto.Email;

            await _context.SaveChangesAsync();

            return new SupplierResponseDto
            {
                Id = supplier.Id,
                Name = supplier.Name,
                Phone = supplier.Phone,
                Email = supplier.Email
            };
        }

        public async Task<bool> DeleteAsync(int tenantId, int id)
        {
            var supplier = await _context.Suppliers
                .FirstOrDefaultAsync(s => s.TenantId == tenantId && s.Id == id);

            if (supplier == null) return false;

            _context.Suppliers.Remove(supplier);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}