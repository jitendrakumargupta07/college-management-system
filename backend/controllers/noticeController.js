const Notice = require('../models/Notice');

exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ expiresAt: { $gt: new Date() } })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const { title, content, type, priority, expiresAt } = req.body;
    const newNotice = new Notice({
      title,
      content,
      type,
      priority,
      createdBy: req.user.id,
      expiresAt
    });
    await newNotice.save();
    res.status(201).json({ message: 'Notice created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    await Notice.findByIdAndUpdate(id, updates);
    res.json({ message: 'Notice updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await Notice.findByIdAndDelete(id);
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};