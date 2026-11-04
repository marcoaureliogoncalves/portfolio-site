
document.addEventListener("DOMContentLoaded", function () {
    const imagens = Array.from(
        document.querySelectorAll(".galeria-dashboard img")
    );

    if (imagens.length === 0) return;

    let indiceAtual = 0;
    let focoAnterior = null;

    const visualizador = document.createElement("div");
    visualizador.className = "visualizador";
    visualizador.setAttribute("role", "dialog");
    visualizador.setAttribute("aria-modal", "true");
    visualizador.setAttribute("aria-label", "Galeria ampliada do dashboard");

    visualizador.innerHTML = `
        <button class="fechar-visualizador"
                aria-label="Fechar imagem">×</button>

        <button class="seta-galeria seta-anterior"
                aria-label="Imagem anterior">❮</button>

        <img class="imagem-ampliada"
             alt="Imagem do dashboard">

        <button class="seta-galeria seta-proxima"
                aria-label="Próxima imagem">❯</button>

        <div class="contador-galeria"></div>
    `;

    document.body.appendChild(visualizador);

    const imagemAmpliada =
        visualizador.querySelector(".imagem-ampliada");

    const contador =
        visualizador.querySelector(".contador-galeria");

    const botaoFechar =
        visualizador.querySelector(".fechar-visualizador");

    const botaoAnterior =
        visualizador.querySelector(".seta-anterior");

    const botaoProximo =
        visualizador.querySelector(".seta-proxima");

    function atualizarImagem() {
        const imagem = imagens[indiceAtual];

        imagemAmpliada.src = imagem.src;
        imagemAmpliada.alt = imagem.alt;

        const tituloTela = imagem.alt.replace(/^Tela \d+\s*-\s*/, "");

        contador.textContent =
          `${tituloTela} — ${indiceAtual + 1} de ${imagens.length}`;
    }

    function abrirGaleria(indice) {
        focoAnterior = document.activeElement;
        indiceAtual = indice;
        atualizarImagem();

        visualizador.classList.add("ativo");
        document.body.style.overflow = "hidden";
        botaoFechar.focus();
    }

    function fecharGaleria() {
        visualizador.classList.remove("ativo");
        document.body.style.overflow = "";
        imagemAmpliada.removeAttribute("src");

        if (focoAnterior) focoAnterior.focus();
    }

    function proximaImagem() {
        indiceAtual = (indiceAtual + 1) % imagens.length;
        atualizarImagem();
    }

    function imagemAnterior() {
        indiceAtual =
            (indiceAtual - 1 + imagens.length) % imagens.length;

        atualizarImagem();
    }

    imagens.forEach(function (imagem, indice) {
        imagem.setAttribute("tabindex", "0");
        imagem.setAttribute("role", "button");

        imagem.addEventListener("click", function () {
            abrirGaleria(indice);
        });

        imagem.addEventListener("keydown", function (evento) {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                abrirGaleria(indice);
            }
        });
    });

    botaoFechar.addEventListener("click", fecharGaleria);
    botaoAnterior.addEventListener("click", imagemAnterior);
    botaoProximo.addEventListener("click", proximaImagem);

    visualizador.addEventListener("click", function (evento) {
        if (evento.target === visualizador) {
            fecharGaleria();
        }
    });

    document.addEventListener("keydown", function (evento) {
        if (!visualizador.classList.contains("ativo")) return;

        if (evento.key === "Escape") {
            fecharGaleria();
        } else if (evento.key === "ArrowRight") {
            proximaImagem();
        } else if (evento.key === "ArrowLeft") {
            imagemAnterior();
        } else if (evento.key === "Tab") {
            const controles = [
                botaoFechar,
                botaoAnterior,
                botaoProximo
            ];

            const primeiro = controles[0];
            const ultimo = controles[controles.length - 1];

            if (evento.shiftKey &&
                document.activeElement === primeiro) {
                evento.preventDefault();
                ultimo.focus();
            } else if (!evento.shiftKey &&
                       document.activeElement === ultimo) {
                evento.preventDefault();
                primeiro.focus();
            }
        }
    });
});
