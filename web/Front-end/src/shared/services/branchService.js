import { branches } from "../mocks/branches";

const IS_MOCK = true;

export const branchService = {
  async getBranches() {
    if (IS_MOCK) {
      return Promise.resolve(branches);
    }

    /*
    const response = await fetch(
      "https://tuweb.com/api/branches"
    );

    if (!response.ok) {
      throw new Error("Error al obtener sucursales");
    }

    return response.json();
    */
  },

  async searchBranches(query) {
    if (IS_MOCK) {
      if (!query.trim()) {
        return [];
      }

      const filtradas = branches.filter((branch) =>
        branch.name
          .toLowerCase()
          .includes(query.toLowerCase())
      );

      return Promise.resolve(filtradas);
    }

    /*
    const response = await fetch(
      `https://tuweb.com/api/branches?search=${query}`
    );

    if (!response.ok) {
      throw new Error("Error al buscar sucursales");
    }

    return response.json();
    */
  },
};