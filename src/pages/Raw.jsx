import React, { useEffect, useState } from "react";

export default function Raw() {
    const [raw, setRaw] = useState([]);
    const [ignore, setIgnore] = useState([]);
    useEffect(() => {
        console.log("Get data");

        fetch("http://localhost:3333/raw/getIgnore")
            .then((response) => response.json())
            .then((data) => {
                setIgnore(data);
            });

        fetch("http://localhost:3333/raw")
            .then((response) => response.json())
            .then((data) => setRaw(data));
    }, []);

    useEffect(() => {
        console.log(raw);
    }, [raw]);

    let ISSUE, printIssue, issueTile;

    const TextDisplay = ({ text }) => {
        text = text.trim();
        text = text.split(" ");

        return text.map((t, i) => {
            let checkBreaks = t.split("&nbsp;");
            if (checkBreaks.length > 0) {
                return checkBreaks.map((t) => {
                    t = t.trim();

                    return <TextButton key={i} word={t} />;
                });
            }

            return <TextButton key={i} word={t} />;
        });
    };

    const TextButton = ({ word }) => {
        word = doesHavePunk(word);

        const ignoreIndex = ignore.findIndex((ig) => ig.word === word);
        if (ignoreIndex >= 0) {
            return <React.Fragment></React.Fragment>;
        }

        const onClick = (e) => {
            const word = e.target.innerHTML;
            fetch(`http://localhost:3333/raw/addIgnore?word=${word}`)
                .then((response) => response.json())
                .then((data) => {
                    setIgnore((ignore) => [...ignore, data]);
                });
        };
        return <button onClick={onClick}>{word}</button>;
    };

    return (
        <div style={{ margin: " 4em 4em" }}>
            Raw
            <div>{raw.length}</div>
            {raw.map((r) => {
                if (!ISSUE) {
                    ISSUE = r.ISSUE;
                } else {
                    if (ISSUE !== r.ISSUE) {
                        ISSUE = r.ISSUE;
                    }
                }
                if (printIssue !== ISSUE) {
                    printIssue = ISSUE;
                    issueTile = true;
                } else {
                    issueTile = false;
                }
                return (
                    <div>
                        {issueTile && <h2>{ISSUE}</h2>}
                        <h4>
                            Title
                            <TextDisplay text={r.title} />
                        </h4>

                        <TextDisplay text={r.text} />
                        <hr />
                    </div>
                );
            })}
        </div>
    );
}

function doesHavePunk(word) {
    word = word.trim();
    const punkList = [".", ",", "?", "!", "%", "/", "$", "#", "?"];
    let hasPunk;
    let punkCleanWord;
    let clearedPunk;
    punkList.forEach((punk) => {
        let punkSplit = word.split(punk);
        if (!punkSplit) return;
        if (punkSplit.length == 1 || punkSplit.length > 2) {
            return;
        }
        const [_word1, _word2] = punkSplit;
        if (maxSplit(_word1) > 1 || maxSplit(_word2) > 1) {
            return;
        }
        // if (_word1.split)
        if (punkSplit.length === 2) {
            hasPunk = true;

            if (punkCleanWord) {
                if (punkCleanWord === _word1) {
                    return;
                } else {
                    throw new Error("WHY??");
                }
            }
            clearedPunk = punk;
            punkCleanWord = _word1;
        }
    });

    function maxSplit(word) {
        let maxSplit = 1;

        punkList.forEach((punk) => {
            const count = word.split(punk).length;
            if (count > maxSplit) {
                maxSplit = count;
            }
        });

        return maxSplit;
    }

    if (!punkCleanWord) {
        return word;
    } else {
        return punkCleanWord;
    }
}
