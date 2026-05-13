import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import jsPDF from "jspdf";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  component: Index,
});

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function formatDateBR(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function dataPorExtenso(date: Date) {
  return `Sete Barras, ${String(date.getDate()).padStart(2, "0")} de ${MESES[date.getMonth()]} de ${date.getFullYear()}`;
}

function Index() {
  const [nome, setNome] = useState("Abraão de Oliveira Fabiano Ferreira da Silva");
  const [sexo, setSexo] = useState<"masculino" | "feminino">("masculino");
  const [rg, setRg] = useState("52528030-3");
  const [endereco, setEndereco] = useState("Wild Jose de Souza Nº 291");
  const [bairro, setBairro] = useState("Centro");
  const [dataTrabalhada, setDataTrabalhada] = useState("2026-04-18");
  const [dataFolga, setDataFolga] = useState("2026-05-08");
  const [previewOpen, setPreviewOpen] = useState(false);

  const gerarPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = 210;
    const marginL = 25;
    const marginR = 25;
    const usableW = pageW - marginL - marginR;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("EXCELENTISSIMO SENHOR PREFEITO MUNICIPAL", pageW / 2, 35, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const texto =
      `Eu, ${nome}, ${sexo}, Portador do RG ${rg}, funcionário público municipal, ` +
      `lotado junto à Secretaria Municipal de Saúde, exercendo a função de Agente de Combate as Endemias, ` +
      `Residente na rua ${endereco} Bairro ${bairro}, no município de Sete Barras, venho através do presente, ` +
      `mui respeitoso, requerer a Folga referente ao dia ${formatDateBR(dataTrabalhada)} Vacinação Antirrábica, ` +
      `para o dia ${formatDateBR(dataFolga)}.`;

    const linhas = doc.splitTextToSize(texto, usableW);
    let y = 55;
    doc.text(linhas, marginL, y, { align: "justify", maxWidth: usableW });
    y += linhas.length * 7 + 15;

    doc.text(dataPorExtenso(new Date()), marginL, y);
    y += 25;

    doc.text("_________________________________", marginL, y);
    y += 6;
    doc.text("Assinatura", marginL, y);
    y += 18;

    doc.text("Ciente e de acordo", marginL, y);
    y += 18;
    doc.text("____________________", marginL, y);
    y += 6;
    doc.text("Paulo Rocha", marginL, y);
    y += 6;
    doc.text("Secretário Municipal de Saúde", marginL, y);

    doc.save(`solicitacao_folga_${nome.split(" ")[0]}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 pb-28">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Solicitação de Folga</h1>
          <p className="text-muted-foreground">
            Preencha os campos e gere o PDF em formato A4.
          </p>
        </header>

        <Card className="bg-card/60 backdrop-blur border-border/60">
          <CardHeader>
            <CardTitle>Dados do funcionário</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="nome">Nome do funcionário</Label>
              <Input id="nome" className="field-input" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="sexo">Sexo</Label>
              <Select value={sexo} onValueChange={(v) => setSexo(v as "masculino" | "feminino")}>
                <SelectTrigger id="sexo" className="field-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rg">Número do RG</Label>
              <Input id="rg" className="field-input" value={rg} onChange={(e) => setRg(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="endereco">Rua e número</Label>
              <Input id="endereco" className="field-input" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" className="field-input" value={bairro} onChange={(e) => setBairro(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="dt">Data trabalhada</Label>
              <Input id="dt" type="date" className="field-input" value={dataTrabalhada} onChange={(e) => setDataTrabalhada(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="df">Data da folga</Label>
              <Input id="df" type="date" className="field-input" value={dataFolga} onChange={(e) => setDataFolga(e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-6 py-4 bg-background/80 backdrop-blur border-t border-border/60">
        <Button size="lg" variant="secondary" onClick={() => setPreviewOpen(true)}>
          Pré-visualizar
        </Button>
        <Button size="lg" onClick={gerarPDF}>
          Gerar PDF
        </Button>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pré-visualização</DialogTitle>
          </DialogHeader>
          <div className="bg-white text-black border rounded-md p-8 leading-relaxed text-sm" style={{ fontFamily: "Helvetica, Arial, sans-serif" }}>
            <p className="text-center font-bold mb-6">
              EXCELENTISSIMO SENHOR PREFEITO MUNICIPAL
            </p>
            <p className="text-justify">
              Eu, {nome}, {sexo}, Portador do RG {rg}, funcionário público municipal,
              lotado junto à Secretaria Municipal de Saúde, exercendo a função de Agente
              de Combate as Endemias, Residente na rua {endereco} Bairro {bairro}, no
              município de Sete Barras, venho através do presente, mui respeitoso,
              requerer a Folga referente ao dia {formatDateBR(dataTrabalhada)} Vacinação
              Antirrábica, para o dia {formatDateBR(dataFolga)}.
            </p>
            <p className="mt-6">{dataPorExtenso(new Date())}</p>
            <p className="mt-8">_________________________________</p>
            <p>Assinatura</p>
            <p className="mt-6">Ciente e de acordo</p>
            <p className="mt-6">____________________</p>
            <p>Paulo Rocha</p>
            <p>Secretário Municipal de Saúde</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
