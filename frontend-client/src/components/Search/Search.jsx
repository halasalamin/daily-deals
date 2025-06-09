import React, { useState, useEffect } from "react";
import { InputBase, Paper, Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Search.module.css";

const API_URL = "http://localhost:4000/api/product";

const Search = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchResults = async () => {
        if (query.trim() === "") {
          setResults([]);
          return;
        }

        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/search?q=${query}`);
          const data = await response.json();
          setResults(data.products || []);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
      <div className={styles.searchContainer} >
        <div className={styles.searchInput}>
        <SearchIcon sx={{ color: "gray", marginRight: "5px" }} />
        <InputBase
          placeholder={t("search_placeholder")}
          sx={{ flex: 1 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        </div>
      {query && (
        <Paper
          sx={{
            position: "absolute",
            top: "40px",
            left: 0,
            right: 0,
            backgroundColor: "white",
            boxShadow: 3,
            maxHeight: 300,
            overflowY: "auto",
            zIndex: 1200,
            borderRadius: "8px",
            padding: "5px 0",
            maxWidth: 500
          }}
        >
          {results.length > 0 ? (
            results.map((item) => (
              <Box
                key={item.id}
                component={Link}
                to={`/product/${item._id}`}
                sx={{
                  display: "flex",
                  padding: "12px 15px",
                  color: "black",
                  textDecoration: "none",
                  borderRadius: "8px",
                  alignItems: 'center',
                  transition: "background-color 0.3s, transform 0.3s",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    transform: "scale(1.02)",
                  },
                }}
                onClick={() => setQuery("")}
              >
                <Box
                  sx={{
                    marginRight: "15px",
                    width: "60px",
                    height: "60px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    className={styles.resultItem}
                    variant="body2"
                    noWrap
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    className={styles.resultItem}
                    variant="body2"
                    color="text.secondary"
                    noWrap
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Box sx={{ padding: "10px", textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {t("no results found")}
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </div>
  );
};

export default Search;
