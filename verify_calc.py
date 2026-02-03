
data = [7448, 4991, 9051, 6374, 4277]

mean = sum(data) / len(data)

# Sample standard deviation
variance = sum((x - mean) ** 2 for x in data) / (len(data) - 1)
std_dev = variance ** 0.5

min_usual = mean - 2 * std_dev
max_usual = mean + 2 * std_dev

print(f"Mean: {mean}")
print(f"Std Dev: {std_dev}")
print(f"Min Usual: {min_usual}")
print(f"Max Usual: {max_usual}")

check_value = 10000
is_unusual = check_value < min_usual or check_value > max_usual
print(f"Is {check_value} unusual? {is_unusual}")
