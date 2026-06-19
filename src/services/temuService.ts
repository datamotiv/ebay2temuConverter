// import localAPI from "./TemuApi";

// export const connectTemu = async (sellerId: string) => {
//   try {
//     const res = await localAPI.post("/v1/auth/connect/temu", {
//       sellerId: 1,
//     });

//     console.log(res, "Temu connect response");

//     return res.data;
//   } catch (error) {
//     console.error("Temu connect error:", error);
//     throw error;
//   }
// };

import localAPI from "./TemuApi";

export const connectTemu = async (sellerId: number) => {
  debugger;
  try {
    const res = await localAPI.post("/api/v1/auth/connect/temu", {
      sellerId,
    });

    console.log(res, "Temu connect response");

    return res.data;
  } catch (error) {
    console.error("Temu connect error:", error);
    throw error;
  }
};

