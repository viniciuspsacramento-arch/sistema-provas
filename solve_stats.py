import statistics
from statistics import NormalDist

# Parameters
mu_men = 69.0
sigma_men = 2.8

mu_women = 63.6
sigma_women = 2.5

mu_birth = 3570
sigma_birth = 500

def percentage(p):
    return f"{p * 100:.2f}%"

print("--- Q21: Altura de Porta (72 in) ---")
dist_men = NormalDist(mu_men, sigma_men)
dist_women = NormalDist(mu_women, sigma_women)
# a. Men < 72
p_men_pass = dist_men.cdf(72)
print(f"a. P(Men < 72) = {percentage(p_men_pass)}")
# b. Women < 72
p_women_pass = dist_women.cdf(72)
print(f"b. P(Women < 72) = {percentage(p_women_pass)}")
# d. 99th percentile for men (cutoff height)
# Usually 'inv_cdf' or 'inv_cdf' equivalent is 'inv_cdf'
# statistics.NormalDist has inv_cdf
height_99 = dist_men.inv_cdf(0.99)
print(f"d. Altura para 99% dos homens = {height_99:.2f} in")

print("\n--- Q22: Altura de Porta Gulfstream (assumindo 60 in) ---")
# Assumption: 60 inches based on typical problem and visual estimation
limit_22 = 60
p_men_22 = dist_men.cdf(limit_22)
print(f"a. P(Men < {limit_22}) = {percentage(p_men_22)}")
p_women_22 = dist_women.cdf(limit_22)
print(f"b. P(Women < {limit_22}) = {percentage(p_women_22)}")

print("\n--- Q23: Tall Clubs International ---")
# Men >= 74
p_men_tall = 1 - dist_men.cdf(74)
print(f"a. P(Men >= 74) = {percentage(p_men_tall)}")
# Women >= 70
p_women_tall = 1 - dist_women.cdf(70)
print(f"b. P(Women >= 70) = {percentage(p_women_tall)}")

print("\n--- Q25: Mulheres nas Forças Armadas (58 to 80 in) ---")
# 58 to 80
p_women_mil = dist_women.cdf(80) - dist_women.cdf(58)
print(f"a. P(58 < Women < 80) = {percentage(p_women_mil)}")

print("\n--- Q26: Homens nas Forças Armadas (Assumindo 60 to 80) ---")
# Assumption: 60 to 80 (common range)
p_men_mil_60_80 = dist_men.cdf(80) - dist_men.cdf(60)
print(f"a. P(60 < Men < 80) = {percentage(p_men_mil_60_80)}")
# Trying 62 just in case
p_men_mil_62_80 = dist_men.cdf(80) - dist_men.cdf(62)
print(f"Alternative with 62: P(62 < Men < 80) = {percentage(p_men_mil_62_80)}")

print("\n--- Q27: Pesos ao Nascer (< 2700 g) ---")
dist_birth = NormalDist(mu_birth, sigma_birth)
p_special_care = dist_birth.cdf(2700)
print(f"a. P(Weight < 2700) = {percentage(p_special_care)}")
