using System.Text.Json.Serialization;

namespace SpaceWorks.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SetorEnum {
    Suporte,
    Redes,
    Desenvolvimento,
}