// Import EF Core library
using Microsoft.EntityFrameworkCore;
// Import our model classes
using POS.API.Models;

// Declare this class belongs to the Data group
namespace POS.API.Data
{
    // Our class inherits all database functionality from DbContext
    public class AppDbContext : DbContext
    {
        // Constructor: receives config, passes it to parent class
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // One DbSet per table — our C# interface to the database
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductSupplier> ProductSuppliers { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<SaleItem> SaleItems { get; set; }

        // Override parent's empty method with our own configuration
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Tell EF Core: RolePermission's PK is both columns combined
            modelBuilder.Entity<RolePermission>()
                .HasKey(rp => new { rp.RoleId, rp.PermissionId });

            // Tell EF Core: ProductSupplier's PK is both columns combined
            modelBuilder.Entity<ProductSupplier>()
                .HasKey(ps => new { ps.ProductId, ps.SupplierId });

            // Tell EF Core: store these decimal columns with 2 decimal places
            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Sale>()
                .Property(s => s.Total)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<SaleItem>()
                .Property(si => si.UnitPrice)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<SaleItem>()
                .Property(si => si.Subtotal)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Customer>()
                .Property(c => c.Balance)
                .HasColumnType("decimal(18,2)");
        }
    }
}