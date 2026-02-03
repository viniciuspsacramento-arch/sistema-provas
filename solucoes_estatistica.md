# Soluções da Lista de Estatística (Questões 21-27)

**Parâmetros Dados (baseados no cabeçalho dos exercícios 21-26):**
*   **Homens:** Altura com distribuição normal, Média ($\mu$) = 69,0 polegadas, Desvio Padrão ($\sigma$) = 2,8 polegadas.
*   **Mulheres:** Altura com distribuição normal, Média ($\mu$) = 63,6 polegadas, Desvio Padrão ($\sigma$) = 2,5 polegadas.

---

### 21. Altura de Porta
*Contexto:* O bonde Mark VI da Disney World e o avião Boeing 757-200 ER têm portas com altura de 72 polegadas.

**a) Qual a porcentagem de homens adultos que podem passar pela porta sem se curvar?**
*   Queremos $P(X < 72)$ para homens.
*   $Z = \frac{72 - 69,0}{2,8} = \frac{3}{2,8} \approx 1,07$
*   Consultando a tabela Z para 1,07, a área à esquerda é aproximadamente $0,8577$.
*   **Resposta:** Aprox. **85,77%**

**b) Qual a porcentagem de mulheres adultas que podem passar pela porta sem se curvar?**
*   Queremos $P(X < 72)$ para mulheres.
*   $Z = \frac{72 - 63,6}{2,5} = \frac{8,4}{2,5} = 3,36$
*   Consultando a tabela Z para 3,36, a área é próxima de $0,9996$ (ou 99,96%).
*   **Resposta:** Aprox. **99,96%**

**c) O projeto da porta de 72 polegadas parece ser adequado? Explique.**
*   **Análise:** Para mulheres, é excelente (>99% passam). Para homens, cerca de 14% terão que se curvar e bater a cabeça se não forem cuidadosos. Embora acomode a maioria, não é ideal para todos os homens.
*   **Resposta:** Depende do critério de "adequado", mas considerando que **14,23% dos homens** teriam que se curvar, pode ser considerado um pouco baixo para um espaço público de alto tráfego.

**d) Qual altura de porta permitiria que 98% dos homens adultos passassem sem se curvar?**
*   Queremos o valor $X$ tal que $P(Homens < X) = 0,98$.
*   O Z-score que separa os 98% inferiores é aproximadamente $2,054$ (ou $2,05$ na tabela comum).
*   $X = \mu + Z \cdot \sigma$
*   $X = 69,0 + 2,054 \cdot (2,8) \approx 69,0 + 5,75 = 74,75$
*   **Resposta:** Aproximadamente **74,75 polegadas** (aprox. 1,90m).

---

### 22. Altura de Porta (Gulfstream 100)
*Contexto:* Porta com altura de 51,6 polegadas.

**a) Qual a porcentagem de homens adultos que podem passar pela porta sem se curvar?**
*   Queremos $P(X < 51,6)$ para homens.
*   $Z = \frac{51,6 - 69,0}{2,8} = \frac{-17,4}{2,8} \approx -6,21$
*   A probabilidade é virtualmente **0%**.
*   **Resposta:** **0%**

**b) Qual a porcentagem de mulheres adultas que podem passar pela porta sem se curvar?**
*   Queremos $P(X < 51,6)$ para mulheres.
*   $Z = \frac{51,6 - 63,6}{2,5} = \frac{-12,0}{2,5} = -4,8$
*   A probabilidade é virtualmente **0%**.
*   **Resposta:** **0%**

**c) O projeto da porta de 51,6 polegadas parece ser adequado?**
*   **Resposta:** **Não.** Praticamente nenhum adulto (homem ou mulher) consegue passar sem se curvar. É extremamente baixa.

**d) Qual altura de porta permitiria que 99% dos homens adultos passassem sem se curvar?**
*   Queremos Z para área 0,99. $Z \approx 2,33$.
*   $X = 69,0 + 2,33 \cdot (2,8) = 69,0 + 6,524 = 75,524$
*   **Resposta:** Aproximadamente **75,52 polegadas**.

---

### 23. Tall Clubs International
*Contexto:* Requisito para homens $\ge 74$ pol, para mulheres $\ge 70$ pol.

**a) Qual porcentagem de homens satisfaz tal exigência?**
*   $P(X \ge 74)$ para homens.
*   $Z = \frac{74 - 69,0}{2,8} = \frac{5}{2,8} \approx 1,79$
*   Área à esquerda de 1,79 é $0,9633$. Área à direita (maior que) é $1 - 0,9633 = 0,0367$.
*   **Resposta:** Cerca de **3,67%** dos homens.

**b) Qual porcentagem de mulheres satisfaz tal exigência?**
*   $P(X \ge 70)$ para mulheres.
*   $Z = \frac{70 - 63,6}{2,5} = \frac{6,4}{2,5} = 2,56$
*   Área à esquerda de 2,56 é $0,9948$. Área à direita é $1 - 0,9948 = 0,0052$.
*   **Resposta:** Cerca de **0,52%** das mulheres.

**c) Os requisitos para homens e mulheres são comparáveis? Por que não?**
*   **Resposta:** Não são comparáveis. É muito mais difícil para uma mulher entrar (top 0,5%) do que para um homem (top 3,7%). O critério para mulheres é muito mais restritivo estatisticamente.

---

### 24. Tall Clubs International (Novos Requisitos)
*Contexto:* Exigência deve ser o "top 4%" (os 4% mais altos) de cada grupo.

**a) Qual o novo limite para homens?**
*   Queremos o $X$ que deixa 4% acima (ou 96% abaixo).
*   Z para 0,96 é aproximadamente $1,75$ (entre 1,75 e 1,76).
*   $X = 69,0 + 1,75 \cdot (2,8) = 69,0 + 4,9 = 73,9$
*   **Resposta:** Aprox. **73,9 polegadas**.

**b) Qual o novo limite para mulheres?**
*   Mesmo Z = 1,75.
*   $X = 63,6 + 1,75 \cdot (2,5) = 63,6 + 4,375 = 67,975$
*   **Resposta:** Aprox. **68,0 polegadas**.

---

### 25. Exigência de Altura para Mulheres nas Forças Armadas
*Contexto:* Requer altura entre 58 e 80 polegadas.

**a) Qual a porcentagem de mulheres que satisfazem essa exigência?**
*   $P(58 < X < 80)$.
*   $Z_{inf} = \frac{58 - 63,6}{2,5} = -2,24 \rightarrow \text{Área} \approx 0,0125$
*   $Z_{sup} = \frac{80 - 63,6}{2,5} = 6,56 \rightarrow \text{Área} \approx 1,0000$
*   Probabilidade = $1,0000 - 0,0125 = 0,9875$
*   **Resposta:** **98,75%**

**b) Se a exigência mudar para excluir as 3% mais baixas e as 3% mais altas, quais os novos limites?**
*   Excluir 3% mais baixas: Área = 0,03. $Z \approx -1,88$.
    *   $X_{min} = 63,6 + (-1,88) \cdot 2,5 = 63,6 - 4,7 = 58,9$
*   Excluir 3% mais altas: Área = 0,97. $Z \approx 1,88$.
    *   $X_{max} = 63,6 + (1,88) \cdot 2,5 = 63,6 + 4,7 = 68,3$
*   **Resposta:** Entre **58,9 pol** e **68,3 pol**.

---

### 26. Exigência de Altura para Homens na Marinha
*Contexto:* Requer altura entre 62 e 76 polegadas.

**a) Qual a porcentagem de homens que satisfazem?**
*   $P(62 < X < 76)$.
*   $Z_{inf} = \frac{62 - 69,0}{2,8} = -2,5 \rightarrow \text{Área} \approx 0,0062$
*   $Z_{sup} = \frac{76 - 69,0}{2,8} = 2,5 \rightarrow \text{Área} \approx 0,9938$
*   Probabilidade = $0,9938 - 0,0062 = 0,9876$
*   **Resposta:** **98,76%**

**b) Novos limites para excluir os 4% mais baixos e 4% mais altos?**
*   Fundo 4% $\rightarrow$ Área 0,04. $Z \approx -1,75$.
    *   $X_{min} = 69,0 - 1,75 \cdot (2,8) = 69,0 - 4,9 = 64,1$
*   Topo 4% $\rightarrow$ Área 0,96. $Z \approx 1,75$.
    *   $X_{max} = 69,0 + 1,75 \cdot (2,8) = 69,0 + 4,9 = 73,9$
*   **Resposta:** Entre **64,1 pol** e **73,9 pol**.

---

### 27. Pesos ao Nascer
*Contexto:* Média $\mu = 3570$ g, Desvio Padrão $\sigma = 500$ g.

**a) Se o hospital planeja leitos especiais para recém-nascidos com menos de 2700 g, qual a porcentagem?**
*   $P(X < 2700)$.
*   $Z = \frac{2700 - 3570}{500} = \frac{-870}{500} = -1,74$
*   Consultando Tabela Z para -1,74: Área = $0,0409$.
*   **Resposta:** Aprox. **4,09%**.
