using POS.API.DTOs.Customer;

namespace POS.API.Services
{
    public interface ICustomerService
    {
        Task<List<CustomerResponseDto>> GetAllAsync(int tenantId);
        Task<CustomerResponseDto?> GetByIdAsync(int tenantId, int id);
        Task<CustomerResponseDto> CreateAsync(int tenantId, CreateCustomerDto dto);
        Task<CustomerResponseDto?> UpdateAsync(int tenantId, int id, UpdateCustomerDto dto);
        Task<bool> DeleteAsync(int tenantId, int id);
    }
}