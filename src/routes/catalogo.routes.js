router.post('/upload', upload.single('archivo'), (req, res) => {
    const path = `uploads/${Date.now()}_${req.file.originalname}`;
    fs.writeFileSync(path, req.file.buffer);
    res.status(200).json({ filePath: path });
});