// Import
use std::{env, fs, io};

// Main
fn main() {
    // Resolve Directories
    let root = env::current_dir()
        .unwrap()
        .join("../../..")
        .canonicalize()
        .unwrap();

    let i_path = root.join("data/input").canonicalize().unwrap();
    let o_path = root.join("data/rs").canonicalize().unwrap();

    // File Names
    let mut names = fs::read_dir(i_path)
        .unwrap()
        .map(|res| res.map(|e| e.path()))
        .collect::<Result<Vec<_>, io::Error>>()
        .unwrap();

    names.sort();

    // Read Files
    for name in names {
        // File Content
        let read = fs::read_to_string(name.clone()).unwrap();

        // Parse and Sort Numbers
        let mut numbers: Vec<u64> = read.lines().map(|s| s.parse::<u64>().unwrap()).collect();
        numbers.sort();

        // Stringify Numbers
        let data: Vec<String> = numbers.iter().map(|n| format!("{:0>8}", n)).collect();

        // Create File
        fs::write(o_path.join(name.file_name().unwrap()), data.join("\n")).unwrap();

        // Sum Numbers
        let sum: u64 = numbers.iter().sum();
        println!("{}", sum);
    }
}
