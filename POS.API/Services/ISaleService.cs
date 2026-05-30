using POS.API.DTOs.Sale;

namespace POS.API.Services
{
    public interface ISaleService
    {
        Task<List<SaleResponseDto>> GetAllAsync(int tenantId);
        Task<SaleResponseDto?> GetByIdAsync(int tenantId, int id);
        Task<SaleResponseDto> CreateAsync(int tenantId, CreateSaleDto dto);
    }
}