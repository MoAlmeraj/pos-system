using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.API.DTOs.Category;
using POS.API.Models;

namespace POS.API.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CategoryResponseDto>> GetAllAsync(int tenantId)
        {
            return await _context.Categories
                .Where(c => c.TenantId == tenantId)
                .Select(c => new CategoryResponseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description
                })
                .ToListAsync();
        }

        public async Task<CategoryResponseDto?> GetByIdAsync(int tenantId, int id)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.TenantId == tenantId && c.Id == id);

            if (category == null) return null;

            return new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            };
        }

        public async Task<CategoryResponseDto> CreateAsync(int tenantId, CreateCategoryDto dto)
        {
            var category = new Category
            {
                TenantId = tenantId,
                Name = dto.Name,
                Description = dto.Description
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            };
        }

        public async Task<CategoryResponseDto?> UpdateAsync(int tenantId, int id, UpdateCategoryDto dto)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.TenantId == tenantId && c.Id == id);

            if (category == null) return null;

            category.Name = dto.Name;
            category.Description = dto.Description;

            await _context.SaveChangesAsync();

            return new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            };
        }

        public async Task<bool> DeleteAsync(int tenantId, int id)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.TenantId == tenantId && c.Id == id);

            if (category == null) return false;

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}