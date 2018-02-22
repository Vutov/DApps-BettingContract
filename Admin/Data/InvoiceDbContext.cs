namespace Admin.Data
{
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;
    using Models.DbModels;

    public class InvoiceDbContext : IdentityDbContext<User>
    {
        public InvoiceDbContext(DbContextOptions<InvoiceDbContext> options)
            : base(options)
        {
        }

        //public virtual DbSet<Invoice> Invoices { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
