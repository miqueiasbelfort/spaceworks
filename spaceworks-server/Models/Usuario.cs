namespace SpaceWorks.Models;

public class Usuario {
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Email { get; set; }
    public string Cargo { get; set; }
    public string Setor { get; set; }
    public string Senha { get; set; }
    public  DateTime CriadoEm { get; set; } = DateTime.Now.ToLocalTime();
}