const Candidate = require("../models/candidates");

// Controller for adding a candidate
exports.addCandidate = async (req, res) => {
  try {
    const { name, position } = req.body;
    const newCandidate = new Candidate({ name, position });
    await newCandidate.save();
    res.status(200).json({ message: "Candidate added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting voting results
exports.getResults = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ votes: -1 });
    const groupedResults = candidates.reduce((acc, candidate) => {
      if (!acc[candidate.position]) {
        acc[candidate.position] = [];
      }
      acc[candidate.position].push(candidate);
      return acc;
    }, {});
    
    res.status(200).json(groupedResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting all candidates
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ position: 1, name: 1 });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting voting results
exports.getResults = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ votes: -1 });
    const groupedResults = candidates.reduce((acc, candidate) => {
      if (!acc[candidate.position]) {
        acc[candidate.position] = [];
      }
      acc[candidate.position].push(candidate);
      return acc;
    }, {});
    
    res.status(200).json(groupedResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting candidates grouped by position
exports.getCandidatesByPosition = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ position: 1, name: 1 });
    
    // Group candidates by position
    const groupedCandidates = candidates.reduce((acc, candidate) => {
      if (!acc[candidate.position]) {
        acc[candidate.position] = [];
      }
      acc[candidate.position].push(candidate);
      return acc;
    }, {});
    res.status(200).json(groupedCandidates);
  } catch (error) {
    console.error('Error in getCandidatesByPosition:', error);
    res.status(500).json({ message: error.message });
  }
};
