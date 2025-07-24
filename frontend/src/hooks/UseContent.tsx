import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export function UseContent() {
  const [contents, setContents] = useState([]);

    function refresh() {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        });
        setContents(response.data.content);
      } catch (error) {
        console.error("Failed to fetch content:", error);
      }
    };

    fetchContent();
  }
  useEffect(() => {
    refresh();
    let interval = setInterval(() => {
      refresh();
    }, 5 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {contents,refresh};
}
