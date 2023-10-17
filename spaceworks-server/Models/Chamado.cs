using SpaceWorks.Enums;
using SpaceWorks.ModelViews;

namespace SpaceWorks.Models;

public class Chamado {
    public int Id { get; set; }
    public UsuarioNoPassword? Usuario { get; set; }
    public string Setor { get; set; }
    public string Titulo { get; set; }
    public string Descricao { get; set; }
    public SetorEnum Direcao { get; set; }
    public bool Status { get; set; }
    public OrdemFechar? OrdemDeFechar { get; set; }
    public OrderEnum Ordem { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now.ToLocalTime();
}