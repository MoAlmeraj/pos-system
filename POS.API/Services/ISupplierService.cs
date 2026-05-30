using POS.API.DTOs.Supplier;

namespace POS.API.Services
{
    public interface ISupplierService
    {
        Task<List<SupplierResponseDto>> GetAllAsync(int tenantId);
        Task<SupplierResponseDto?> GetByIdAsync(int tenantId, int id);
        Task<SupplierResponseDto> CreateAsync(int tenantId, CreateSupplierDto dto);
        Task<SupplierResponseDto?> UpdateAsync(int tenantId, int id, UpdateSupplierDto dto);
        Task<bool> DeleteAsync(int tenantId, int id);
    }
}