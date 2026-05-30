using POS.API.DTOs.Category;

namespace POS.API.Services
{
    public interface ICategoryService
    {
        Task<List<CategoryResponseDto>> GetAllAsync(int tenantId);
        Task<CategoryResponseDto?> GetByIdAsync(int tenantId, int id);
        Task<CategoryResponseDto> CreateAsync(int tenantId, CreateCategoryDto dto);
        Task<CategoryResponseDto?> UpdateAsync(int tenantId, int id, UpdateCategoryDto dto);
        Task<bool> DeleteAsync(int tenantId, int id);
    }
}