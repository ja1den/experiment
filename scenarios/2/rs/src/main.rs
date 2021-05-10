// Import
use std::{env, io::prelude::*, net::TcpListener};

// Main Function
fn main() {
	// Read Maximum
	let args: Vec<String> = env::args().collect();

	if args.len() != 2 {
		println!("argument 'max' must be defined");
		std::process::exit(1);
	}

	// Initialise Count
	let max = match args[1].parse::<i32>() {
		Ok(n) => n,
		Err(_) => {
			println!("argument 'max' must be an integer");
			std::process::exit(1);
		}
	};
	let mut i = 0;

	// Listen on 4000
	let listener = TcpListener::bind("127.0.0.1:4000").unwrap();

	println!("http://localhost:4000");

	// Iterate on Requests
	for stream in listener.incoming() {
		let mut stream = stream.unwrap();

		// Increment
		i = i + 1;

		// Send Response
		stream.write("HTTP/1.1 200 OK\r\n\r\n".as_bytes()).unwrap();
		stream.flush().unwrap();

		println!("{}", i);

		// Check Maximum
		if i == max {
			break;
		};
	}
}
