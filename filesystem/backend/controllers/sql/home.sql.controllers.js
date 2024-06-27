export const getHome = async (req, res) => {
    res.status(200).json({ message: "SQL Database is live..." });
}