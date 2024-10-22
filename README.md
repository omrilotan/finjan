# finjan

<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path fill="#8B5B29" d="M70 40h60l20 20v60H50V60ZM150 80l20-20v40l-20-20Z"/></svg>

🍵 Command line utility that runs internet speed tests via fast.com at set intervals and write the results to a CSV file.

```sh
npx finjan
```

```
npx finjan [-m <minutes:60>] [-f <file:results.csv>] [-s] [-h]

Options:
	-m, --minutes <minutes:60>  Number of minutes to log
	-f, --file <file:results.csv>  File to log to
	-s, --silent  Do not output to console
	-h, --help  Show this help message
```
