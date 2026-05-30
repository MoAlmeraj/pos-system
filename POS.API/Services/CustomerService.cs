using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.API.DTOs.Customer;
using POS.API.Models;

namespace POS.API.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly AppDbContext _context;

        public CustomerService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CustomerResponseDto>> GetAllAsync(int tenantId)
        {
            return await _context.Customers
                .Where(c => c.TenantId == tenantId)
                .Select(c => new CustomerResponseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Phone = c.Phone,
                    Email = c.Email,
                    Balance = c.Balance
                })
                .ToListAsync();
        }

        public async Task<CustomerResponseDto?> GetByIdAsync(int tenantId, int id)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.TenantId == tenantId && c.Id == id);

            if (customer == null) return null;

            return new CustomerResponseDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Phone = customer.Phone,
                Email = customer.Email,
                Balance = customer.Balance
            };
        }

        public async Task<CustomerResponseDto> CreateAsync(int tenantId, CreateCustomerDto dto)
        {
            var customer = new Customer
            {
                TenantId = tenantId,
                Name = dto.Name,
                Phone = dto.Phone,
                Email = dto.Email,
                Balance = dto.Balance
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return new CustomerResponseDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Phone = customer.Phone,
                Email = customer.Email,
                Balance = customer.Balance
            };
        }

        public async Task<CustomerResponseDto?> UpdateAsync(int tenantId, int id, UpdateCustomerDto dto)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.TenantId == tenantId && c.Id == id);

            if (customer == null) return null;

            customer.Name = dto.Name;
            customer.Phone = dto.Phone;
            customer.Email = dto.Email;
            customer.Balance = dto.Balance;

            await _context.SaveChangesAsync();

            return new CustomerResponseDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Phone = customer.Phone,
                Email = customer.Email,
                Balance = customer.Balance
            };
        }

        public async Task<bool> DeleteAsync(int tenantId, int id)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.TenantId == tenantId && c.Id == id);

            if (customer == null) return false;

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}