# Usage
## Running the backend

```
npm start
```
## Making a request

```
GET request to /api/query/format/?q={SEARCH TERMS}
```



## Assumptions

```
1. '=<' was mistyped in the requirements (supposed to be '<=')
2. Query String for GET is URL Encoded (e.g. space is %20)
3. there's only 1 type of whitespace (i.e. %20)
4. There is a space between each search term/AND/OR
5. colon (:) is not part of the query string
6. AND/OR/true/false/len() and new commands are case-sensitive
7. booleans cannot be combined with other search terms (e.g. ":false"[NOTHING ELSE] or ":!true"[NOTHING ELSE])
8. double negation is not possible (e.g. ":!!false")
9. search terms don't start with AND or OR (e.g. incorrect: ":AND >5")
10. If AND and OR is used in the same command, brackets "()" will be used to specify operation order (e.g. incorrect way: ":term AND term OR term AND term", correct way ":(term AND term) OR (term AND term)")
11. commands/search terms are used correctly (i.e. there's no error handling for inputs)
12. >= is "$gte"
13. each ! negates one search term only (e.g. ":>5 AND !len(4)")
```


## Test
This was simply created to ensure that code changes don't affect output. There's definitely improvements to be made here. e.g. splitting the test routes, moving it to a testing framework, etc. It is just a quick and dirty way to validate.

```
Send a GET request to /api/query/format/test
```

## Suggested Improvements

```
1. Current implementation enables users to search multiple types within a single field. I recommend creating additional routes to handle different types (e.g. /api/query/format/number). Reason: it wouldn't make sense for this to occur: ":>500 AND =BLUE"
2. It would be better to have stricter types in the commands. A possible implementation would be to make all strings require quotes (then numbers would return a parseInt(#) value). Reason: ":=500" can mean equal to the numeric OR the string value 500.
3. There is almost no reason to check if a value is greater than a string number e.g. ">400" currently converts to { "$gt": "400" }. I expected it to be { "$gt": 400 }.
4. My implementation of negations can be improved to include ()'d search terms if assumption 13 is incorrect.
```
