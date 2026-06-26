export const downloadReport = async (id: string) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(
      `${
        import.meta.env.VITE_BASE_API_KEY
      }/fitment/listing/download/report?id=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch the file.");
    }

    const fileHeader = response.headers.get("x-download-filename");
    const fileNames = fileHeader?.includes(",")
      ? fileHeader.split(",")
      : [fileHeader || "report.zip"];

    // Download the first file
    const blob = await response.blob();
    triggerDownload(blob, fileNames[0]);

    // Download additional files
    for (let i = 1; i < fileNames.length; i++) {
      const fileName = fileNames[i];

      const additionalResponse = await fetch(
        `${
          import.meta.env.VITE_BASE_API_KEY
        }/fitment/listing/download/report?id=${id}&fileName=${fileName}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!additionalResponse.ok) {
        console.warn(`Failed to fetch file: ${fileName}`);
        continue;
      }

      const additionalBlob = await additionalResponse.blob();
      triggerDownload(additionalBlob, fileName);
    }
  } catch (error) {
    console.error("Download failed", error);
  }
};

// trigger  download in  browser
const triggerDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
