using POS.API.DTOs.Product;

namespace POS.API.Services
{
    public interface IProductService
    {
        Task<List<ProductResponseDto>> GetAllAsync(int tenantId);
        Task<ProductResponseDto?> GetByIdAsync(int tenantId, int id);
        Task<ProductResponseDto> CreateAsync(int tenantId, CreateProductDto dto);
        Task<ProductResponseDto?> UpdateAsync(int tenantId, int id, UpdateProductDto dto);
        Task<bool> DeleteAsync(int tenantId, int id);
    }
}