// Import
use std::env;

// Main Function
fn main() {
	// Read the input as a string.
	let input = &env::args().collect::<Vec<String>>()[1];

	// Parse the string into a number.
	let parsed_input: i32 = input.parse().unwrap();

	// Log the number to the console.
	println!("{}", parsed_input);
}
