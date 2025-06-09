```javascript 
function isPrime(number) { // Handle edge cases: numbers less than 2 are not prime if (number < 2) {
    return \"Not prime\"; } // Check for divisibility from 2 up to the square root of the number for (let i=2; i
    <=Math.sqrt(number); i++) { if (number % i===0) { let factors=[]; //Find all factors for(let j=1; j <=number; j++){
    if(number % j===0){ factors.push(j); } } return `Not prime <br> Factors: ${factors.join(\", \")}`; } } return
    \"Prime\"; } // Example usage: console.log(isPrime(2)); // Output: Prime console.log(isPrime(15)); // Output: Not
    prime <br> Factors: 1, 3, 5, 15 console.log(isPrime(97));  // Output: Prime console.log(isPrime(1));   // Output: Not prime console.log(isPrime(0));   // Output: Not prime console.log(isPrime(100)); // Output: Not prime
     Factors: 1, 2, 4, 5, 10, 20, 25, 50, 100  ```