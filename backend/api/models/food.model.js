import pool from "../../config/database.js";

class FoodModel {
  async getAllFood() {
    const [rows] = await pool.query(`SELECT * FROM FOOD_AND_DrINK`);
    return rows;
  }

  async getFoodById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM FOOD_AND_DRINK WHERE ItemID = ?`,
      [id]
    );
    return rows[0];
  }

  async getPopcornItems() {
    const [rows] = await pool.query(`
      SELECT 
        f.ItemID, f.Name, f.Price, f.StockQuantity, f.IsAvailable, 
        p.Flavor, p.Size
      FROM FOOD_AND_DRINK f
      JOIN POPCORN p ON f.ItemID = p.ItemID;
    `);
    return rows;
  }

  async getDrinkItems() {
    const [rows] = await pool.query(`
      SELECT 
        f.ItemID, f.Name, f.Price, f.StockQuantity, f.IsAvailable, 
        d.Size
      FROM FOOD_AND_DRINK f
      JOIN DRINK d ON f.ItemID = d.ItemID;
    `);
    return rows;
  }
  async getOtherItems() {
    const [rows] = await pool.query(`
      SELECT 
        f.ItemID, f.Name, f.Price, f.StockQuantity, f.IsAvailable
      FROM FOOD_AND_DRINK f
      WHERE f.Type = 'OTHERS';
    `);
    return rows;
  }
}

export default new FoodModel();
