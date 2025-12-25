import Bed from '../models/Bed.js';

// Public: list all active beds
export const getBeds = async (_req, res) => {
  try {
    const beds = await Bed.find({ isActive: true }).sort({ bedNumber: 1 });
    res.json({ success: true, data: beds });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch beds', error: error.message });
  }
};

// Public: list beds for a specific ward
export const getBedsByWard = async (req, res) => {
  try {
    const { ward } = req.params;
    const beds = await Bed.find({ ward, isActive: true }).sort({ bedNumber: 1 });
    res.json({ success: true, data: beds });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch beds by ward', error: error.message });
  }
};

// Public: availability summary across wards
export const getBedAvailabilitySummary = async (_req, res) => {
  try {
    const wards = await Bed.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$ward',
          total: { $sum: 1 },
          available: { $sum: { $cond: [{ $eq: ['$status', 'Available'] }, 1, 0] } },
          occupied: { $sum: { $cond: [{ $eq: ['$status', 'Occupied'] }, 1, 0] } },
          maintenance: { $sum: { $cond: [{ $eq: ['$status', 'Maintenance'] }, 1, 0] } },
          cleaning: { $sum: { $cond: [{ $eq: ['$status', 'Cleaning'] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          ward: '$_id',
          total: 1,
          available: 1,
          occupied: 1,
          maintenance: 1,
          cleaning: 1
        }
      },
      { $sort: { ward: 1 } }
    ]);

    const totals = wards.reduce(
      (acc, ward) => ({
        totalBeds: acc.totalBeds + ward.total,
        availableBeds: acc.availableBeds + ward.available,
        occupiedBeds: acc.occupiedBeds + ward.occupied,
        maintenanceBeds: acc.maintenanceBeds + ward.maintenance,
        cleaningBeds: acc.cleaningBeds + ward.cleaning
      }),
      { totalBeds: 0, availableBeds: 0, occupiedBeds: 0, maintenanceBeds: 0, cleaningBeds: 0 }
    );

    res.json({ success: true, data: { wards, totals } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bed availability', error: error.message });
  }
};

// Protected: update bed status
export const updateBedStatus = async (req, res) => {
  try {
    const { bedId } = req.params;
    const { status } = req.body;
    const allowed = ['Available', 'Occupied', 'Maintenance', 'Cleaning'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid bed status' });
    }

    const bed = await Bed.findOneAndUpdate({ _id: bedId, isActive: true }, { status }, { new: true });
    if (!bed) {
      return res.status(404).json({ success: false, message: 'Bed not found' });
    }

    res.json({ success: true, data: bed });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update bed status', error: error.message });
  }
};

// Public: get detailed bed list with occupancy info
export const getDetailedBeds = async (_req, res) => {
  try {
    const beds = await Bed.find({ isActive: true })
      .populate('occupiedBy', 'firstName lastName ward')
      .sort({ bedNumber: 1 });
    res.json({ success: true, data: beds });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch detailed beds', error: error.message });
  }
};
