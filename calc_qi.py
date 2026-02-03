import statistics
from math import erf, sqrt

def normal_cdf(x, mu=0, sigma=1):
    return 0.5 * (1 + erf((x - mu) / (sigma * sqrt(2))))

mu = 100
sigma = 15

# Usual Range
min_usual = mu - 2 * sigma
max_usual = mu + 2 * sigma
print(f"Usual Range: [{min_usual}, {max_usual}]")

# Scenarios (Assumed based on common textbook problems)
# Q17: P(X > 115) - Above 1 SD
q17_val = 115
p17 = 1 - normal_cdf(q17_val, mu, sigma)
print(f"Q17 (X > {q17_val}): {p17:.4f} ({p17*100:.2f}%) - Usual? {min_usual <= q17_val <= max_usual}")

# Q18: P(X < 85) - Below 1 SD
q18_val = 85
p18 = normal_cdf(q18_val, mu, sigma)
print(f"Q18 (X < {q18_val}): {p18:.4f} ({p18*100:.2f}%) - Usual? {min_usual <= q18_val <= max_usual}")

# Q19: P(110 < X < 140) - Between range, touching unusual
q19_min = 110
q19_max = 140
p19 = normal_cdf(q19_max, mu, sigma) - normal_cdf(q19_min, mu, sigma)
print(f"Q19 ({q19_min} < X < {q19_max}): {p19:.4f} ({p19*100:.2f}%)")
print(f"Is {q19_max} unusual? {not (min_usual <= q19_max <= max_usual)}")
