import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, Timer, Dumbbell, Target, Save } from 'lucide-react';
import { mockExercises } from '../data/mockExercises';

const ExerciseLogger = ({ isOpen, onClose, onSave }) => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Select Exercise, 2: Log Details

  // Exercise log data
  const [exerciseLog, setExerciseLog] = useState({
    exerciseId: '',
    name: '',
    sets: [],
    notes: '',
    duration: 0 // total exercise duration
  });

  // Current set being added
  const [currentSet, setCurrentSet] = useState({
    reps: '',
    weight: '',
    duration: '', // for time-based exercises
    restTime: '',
    notes: ''
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'chest', label: 'Chest' },
    { value: 'back', label: 'Back' },
    { value: 'shoulders', label: 'Shoulders' },
    { value: 'arms', label: 'Arms' },
    { value: 'legs', label: 'Legs' },
    { value: 'core', label: 'Core' },
    { value: 'cardio', label: 'Cardio' }
  ];

  // Fetch exercises from API
  useEffect(() => {
    if (isOpen) {
      fetchExercises();
    }
  }, [isOpen]);

  // Filter exercises based on search and category
  useEffect(() => {
    let filtered = exercises;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exercise => exercise.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredExercises(filtered);
  }, [exercises, searchTerm, selectedCategory]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/exercises');
      const data = await response.json();
      if (data.success) {
        setExercises(data.data);
      } else {
        // Fallback to mock data if API fails
        console.log('API failed, using mock data');
        setExercises(mockExercises);
      }
    } catch (error) {
      console.error('Error fetching exercises, using mock data:', error);
      // Use mock data as fallback
      setExercises(mockExercises);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setExerciseLog({
      exerciseId: exercise._id,
      name: exercise.name,
      sets: [],
      notes: '',
      duration: 0
    });
    setStep(2);
  };

  const addSet = () => {
    if (!currentSet.reps && !currentSet.duration) {
      alert('Please enter reps or duration for the set');
      return;
    }

    const newSet = {
      reps: currentSet.reps ? parseInt(currentSet.reps) : undefined,
      weight: currentSet.weight ? parseFloat(currentSet.weight) : undefined,
      duration: currentSet.duration ? parseInt(currentSet.duration) : undefined,
      restTime: currentSet.restTime ? parseInt(currentSet.restTime) : undefined,
      notes: currentSet.notes
    };

    setExerciseLog(prev => ({
      ...prev,
      sets: [...prev.sets, newSet]
    }));

    // Reset current set
    setCurrentSet({
      reps: '',
      weight: '',
      duration: '',
      restTime: '',
      notes: ''
    });
  };

  const removeSet = (index) => {
    setExerciseLog(prev => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (exerciseLog.sets.length === 0) {
      alert('Please add at least one set');
      return;
    }

    onSave(exerciseLog);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setSelectedExercise(null);
    setExerciseLog({
      exerciseId: '',
      name: '',
      sets: [],
      notes: '',
      duration: 0
    });
    setCurrentSet({
      reps: '',
      weight: '',
      duration: '',
      restTime: '',
      notes: ''
    });
    setSearchTerm('');
    setSelectedCategory('all');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {step === 1 ? 'Select Exercise' : `Log: ${selectedExercise?.name}`}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="mt-2 text-indigo-200 hover:text-white transition-colors"
              >
                ← Back to exercise selection
              </button>
            )}
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {step === 1 && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search exercises..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Exercise List */}
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading exercises...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredExercises.map((exercise) => (
                      <motion.div
                        key={exercise._id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleExerciseSelect(exercise)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{exercise.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                                {exercise.category}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                {exercise.difficulty}
                              </span>
                            </div>
                          </div>
                          <Dumbbell className="w-6 h-6 text-indigo-600 ml-4" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 2 && selectedExercise && (
              <div className="space-y-6">
                {/* Exercise Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">{selectedExercise.name}</h3>
                  <p className="text-gray-600 mt-1">{selectedExercise.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                      {selectedExercise.category}
                    </span>
                    {selectedExercise.muscleGroups?.map((muscle, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {muscle.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Add Set Form */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Set
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedExercise.metrics?.hasReps && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reps
                        </label>
                        <input
                          type="number"
                          value={currentSet.reps}
                          onChange={(e) => setCurrentSet(prev => ({ ...prev, reps: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="12"
                        />
                      </div>
                    )}

                    {selectedExercise.metrics?.hasWeight && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={currentSet.weight}
                          onChange={(e) => setCurrentSet(prev => ({ ...prev, weight: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="50"
                        />
                      </div>
                    )}

                    {selectedExercise.metrics?.hasTime && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration (sec)
                        </label>
                        <input
                          type="number"
                          value={currentSet.duration}
                          onChange={(e) => setCurrentSet(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="30"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rest (sec)
                      </label>
                      <input
                        type="number"
                        value={currentSet.restTime}
                        onChange={(e) => setCurrentSet(prev => ({ ...prev, restTime: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="60"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Set Notes (optional)
                    </label>
                    <input
                      type="text"
                      value={currentSet.notes}
                      onChange={(e) => setCurrentSet(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="How did this set feel?"
                    />
                  </div>

                  <button
                    onClick={addSet}
                    className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Set
                  </button>
                </div>

                {/* Sets List */}
                {exerciseLog.sets.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Completed Sets</h4>
                    {exerciseLog.sets.map((set, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-gray-900">Set {index + 1}</span>
                          {set.reps && <span className="text-gray-600">{set.reps} reps</span>}
                          {set.weight && <span className="text-gray-600">{set.weight} kg</span>}
                          {set.duration && <span className="text-gray-600">{set.duration}s</span>}
                          {set.restTime && <span className="text-gray-600">Rest: {set.restTime}s</span>}
                        </div>
                        <button
                          onClick={() => removeSet(index)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Exercise Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exercise Notes (optional)
                  </label>
                  <textarea
                    value={exerciseLog.notes}
                    onChange={(e) => setExerciseLog(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="3"
                    placeholder="Any observations about this exercise?"
                  />
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-lg font-semibold"
                  disabled={exerciseLog.sets.length === 0}
                >
                  <Save className="w-6 h-6 mr-2" />
                  Save Exercise
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExerciseLogger;
