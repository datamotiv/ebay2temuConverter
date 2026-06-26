// import localAPI from "./TemuApi";

// export const connectTemu = async (sellerId: string) => {
//   try {
//     const res = await localAPI.post("/v1/auth/connect/temu", {
//       sellerId: 1,
//     });


//     return res.data;
//   } catch (error) {
//     console.error("Temu connect error:", error);
//     throw error;
//   }
// };

import localAPI from "./TemuApi";

export const connectTemu = async (sellerId: number) => {
  try {
    const res = await localAPI.post("/v1/auth/connect/temu", {
      sellerId,
    });


    return res.data;
  } catch (error) {
    console.error("Temu connect error:", error);
    throw error;
  }
};

