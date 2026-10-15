import React, { createContext, useContext, useState } from 'react';
import { ProjectCar, ChecklistItem, SpecItem, PhotoItem, ExpenseItem } from '../types';
import { INITIAL_PROJECTS } from '../data/initialData';

interface ProjectsContextType {
  projects: ProjectCar[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  getProject: (id: string) => ProjectCar | undefined;
  updateSpec: (projectId: string, specId: string, field: 'label' | 'value', value: string) => void;
  addSpec: (projectId: string) => void;
  deleteSpec: (projectId: string, specId: string) => void;
  toggleChecklistItem: (projectId: string, itemId: string) => void;
  addChecklistItem: (projectId: string, text: string) => void;
  deleteChecklistItem: (projectId: string, itemId: string) => void;
  addPhotoToProject: (projectId: string, photo: Omit<PhotoItem, 'id'>) => void;
  addExpenseToProject: (projectId: string, expense: Omit<ExpenseItem, 'id'>) => void;
  deleteExpenseFromProject: (projectId: string, expenseId: string) => void;
  addProject: (project: Omit<ProjectCar, 'id'>) => void;
  deleteProject: (projectId: string) => void;
  currentDraftPhoto: { uri?: string; title?: string } | null;
  setCurrentDraftPhoto: (photo: { uri?: string; title?: string } | null) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectCar[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('bmw-e30-drift-build');
  const [currentDraftPhoto, setCurrentDraftPhoto] = useState<{ uri?: string; title?: string } | null>({
    uri: undefined,
    title: 'Coilover install',
  });

  const getProject = (id: string) => projects.find((p) => p.id === id);

  const updateSpec = (projectId: string, specId: string, field: 'label' | 'value', value: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id !== projectId
          ? project
          : {
              ...project,
              specs: project.specs.map((spec) =>
                spec.id === specId ? { ...spec, [field]: value } : spec
              ),
            }
      )
    );
  };

  const addSpec = (projectId: string) => {
    const newSpec: SpecItem = {
      id: `${projectId}-spec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      label: '',
      value: '',
    };
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, specs: [...project.specs, newSpec] } : project
      )
    );
  };

  const deleteSpec = (projectId: string, specId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, specs: project.specs.filter((spec) => spec.id !== specId) }
          : project
      )
    );
  };

  const toggleChecklistItem = (projectId: string, itemId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updatedChecklist = proj.checklist.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        const allCompleted = updatedChecklist.length > 0 && updatedChecklist.every((i) => i.completed);
        const noneCompleted = updatedChecklist.every((i) => !i.completed);

        const newStatus: 'Planning' | 'In Progress' | 'Completed' = allCompleted
          ? 'Completed'
          : noneCompleted && proj.status === 'Planning'
          ? 'Planning'
          : 'In Progress';

        return {
          ...proj,
          status: newStatus,
          checklist: updatedChecklist,
          lastUpdated: 'Updated just now',
        };
      })
    );
  };

  const addChecklistItem = (projectId: string, text: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const newItem: ChecklistItem = {
          id: `item-${Date.now()}`,
          text,
          completed: false,
        };
        const updatedList = [...proj.checklist, newItem];
        return {
          ...proj,
          status: proj.status === 'Completed' ? 'In Progress' : proj.status,
          checklist: updatedList,
          lastUpdated: 'Updated just now',
        };
      })
    );
  };

  const deleteChecklistItem = (projectId: string, itemId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updatedList = proj.checklist.filter((item) => item.id !== itemId);
        const allCompleted = updatedList.length > 0 && updatedList.every((i) => i.completed);
        return {
          ...proj,
          status: allCompleted ? 'Completed' : proj.status,
          checklist: updatedList,
          lastUpdated: 'Updated just now',
        };
      })
    );
  };

  const addPhotoToProject = (projectId: string, photo: Omit<PhotoItem, 'id'>) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const newPhoto: PhotoItem = {
          id: `photo-${Date.now()}`,
          ...photo,
          caption: `${proj.photos.length + 1} of ${proj.photos.length + 1} · ${proj.title}`,
        };
        return {
          ...proj,
          photos: [...proj.photos, newPhoto],
          lastUpdated: 'Updated just now',
        };
      })
    );
  };

  const addExpenseToProject = (projectId: string, expense: Omit<ExpenseItem, 'id'>) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const newExpense: ExpenseItem = {
          id: `exp-${Date.now()}`,
          ...expense,
        };
        const updatedExpenses = [newExpense, ...(proj.expenses || [])];
        const newTotalSpent = updatedExpenses.reduce((sum, e) => sum + e.amount, 0);

        return {
          ...proj,
          expenses: updatedExpenses,
          totalSpent: newTotalSpent,
          lastUpdated: 'Updated just now',
        };
      })
    );
  };

  const deleteExpenseFromProject = (projectId: string, expenseId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updatedExpenses = (proj.expenses || []).filter((e) => e.id !== expenseId);
        const newTotalSpent = updatedExpenses.reduce((sum, e) => sum + e.amount, 0);

        return {
          ...proj,
          expenses: updatedExpenses,
          totalSpent: newTotalSpent,
          lastUpdated: 'Updated just now',
        };
      })
    );
  };

  const addProject = (projectData: Omit<ProjectCar, 'id'>) => {
    const newId = projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProject: ProjectCar = {
      ...projectData,
      id: newId,
      expenses: projectData.expenses || [],
    };
    setProjects((prev) => [newProject, ...prev]);
  };

  const deleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        selectedProjectId,
        setSelectedProjectId,
        getProject,
        updateSpec,
        addSpec,
        deleteSpec,
        toggleChecklistItem,
        addChecklistItem,
        deleteChecklistItem,
        addPhotoToProject,
        addExpenseToProject,
        deleteExpenseFromProject,
        addProject,
        deleteProject,
        currentDraftPhoto,
        setCurrentDraftPhoto,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
