namespace POS.API.DTOs.Sale
{
    public class SaleResponseDto
    {
        public int Id { get; set; }
        public string? CustomerName { get; set; }
        public DateTime SaleDate { get; set; }
        public decimal Total { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public List<SaleItemResponseDto> Items { get; set; } = new List<SaleItemResponseDto>();
    }
}