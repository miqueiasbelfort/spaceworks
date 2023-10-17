using Microsoft.EntityFrameworkCore;
using SpaceWorks.Models;
using SpaceWorks.ModelViews;

namespace SpaceWorks.Data;

public class DatabaseContext : DbContext {
    
    public DbSet<Usuario> Usuarios {get; set;}
    public DbSet<Chamado> Chamados {get; set;}
    public DbSet<UsuarioNoPassword> UsuarioNoPasswords {get; set;}
    public DbSet<OrdemFechar> ordemFechars {get; set;}

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("DataSource=app.db;Cache=Shared");
    }
}