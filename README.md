### My Javascript solutions to adventofcode.com puzzles

This projects includes a start script that will download the input file from adventofcode.com and run the solution against it.

1. Install Node (if you don't have it)

2. Clone the repo
   
3. Copy your session token from adventofcode.com
   - go to adventofcode.com
   - open dev tools (right click and select inspect element)
   - select the Application tab
   - copy the session cookie

4. Create a file called `.env` with this content
   
```bash
ADVENT_OF_CODE_SESSION=<Session token you copied in step 3>
```

5. Run the script
```bash
run-solution.sh --year 2023 --day 1
```
