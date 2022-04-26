import React, { useState, useEffect } from "react";

export default function Home() {
    const [search, setSearch] = useState("");
    const [searchTimer, setSearchTimer] = useState(null);
    const [results, setResults] = useState([{ title: "Try search", _id: 12 }]);
    useEffect(() => {
        if (searchTimer) {
            clearInterval(searchTimer);
        }
        const timer = setTimeout(() => {
            console.log(search);

            fetch(`http://localhost:3333/raw/search?search=${encodeURI(search)}`)
                .then((response) => response.json())
                .then((data) => {
                    debugger;
                    console.log(data);
                    setResults(data);
                });
        }, 3000);
        setSearchTimer(timer);
        return () => clearInterval(searchTimer);
    }, [search]);

    return (
        <div style={{ margin: " 4em 4em" }}>
            Search <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
            <p>{results.length}</p>
            {results.map((result, index) => {
                return (
                    <div key={result._id}>
                        <span>
                            #{index + 1} Count:{result.count}
                        </span>
                        <h3>{result.title}</h3>
                        <h5>{result.ISSUE}</h5>
                        <p>{result.text}</p>
                        <hr />
                    </div>
                );
            })}
        </div>
    );
}
