using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WebApi_Pract.Models;

public partial class WebApiPractContext : DbContext
{
    public WebApiPractContext()
    {
    }

    public WebApiPractContext(DbContextOptions<WebApiPractContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserLogin> UserLogins { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql("Host=Localhost;Database=WebApiPract;Username=postgres;password=Tatva@123");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Products_pkey");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Role_pkey");

            entity.Property(e => e.Id).HasDefaultValueSql("nextval('\"Role_id_seq\"'::regclass)");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("User_pkey");

            entity.Property(e => e.Id).HasDefaultValueSql("nextval('\"User_id_seq\"'::regclass)");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_role");
        });

        modelBuilder.Entity<UserLogin>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("UserLogin_pkey");

            entity.Property(e => e.Id).HasDefaultValueSql("nextval('\"UserLogin_id_seq\"'::regclass)");

            entity.HasOne(d => d.User).WithMany(p => p.UserLogins)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_userid");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
