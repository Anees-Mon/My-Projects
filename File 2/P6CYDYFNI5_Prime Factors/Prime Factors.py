n= int(input())
prime_factors= set()
while n%2 == 0:
    prime_factors.add(2)
    n//= 2
for i in range(3, int(n ** 0.5)+1, 2):
    while n%i == 0:
        prime_factors.add(i)
        n//= i

if n > 2:
    prime_factors.add(n)

print(*prime_factors)