import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  fetchConstructionProject,
  projectRoute,
  type ConstructionProjectSummary,
} from '../../services/constructionProjectService';
import constructionCostService from '../../services/constructionCostService';
import { useAuth } from '../../context/AuthContext';
import ToolShell from '../UI/ToolShell';
import ResultPaywall from '../UI/ResultPaywall';
import EstimatorReport from './EstimatorReport';
import { BUILDING_LABELS } from './estimatorCopy';
import plateBuild from '../../assets/plate-build.png';
import type { ConstructionEstimate, ConstructionSpecs } from '../../types/construction';

const PROJECT_FAQ = [
  {
    question: 'What do I get for ₦399?',
    answer:
      'Each build project is ₦399. You get the full total, finishing comparison, bill of quantities, labour breakdown, staged cash calendar, and a print-ready PDF for that project.',
  },
  {
    question: 'Can I access this later?',
    answer:
      'Yes. Paid projects are saved to your DirectHome profile. Guest buyers can create an account with the same email to claim their projects.',
  },
];

function paidEstimate(project: ConstructionProjectSummary): ConstructionEstimate | null {
  if (project.status !== 'paid') return null;
  if (project.estimate && Number(project.estimate.grandTotal) > 0) {
    return project.estimate;
  }
  const specs = project.specs as ConstructionSpecs;
  if (!specs?.buildingType || !specs.totalSquareMeters) return null;
  try {
    return constructionCostService.calculateEstimate(specs);
  } catch {
    return null;
  }
}

const ConstructionProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState<ConstructionProjectSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);

  const loadProject = async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    const result = await fetchConstructionProject({ projectId });
    if (!result.ok || !result.project) {
      setError(result.error || 'Project not found.');
      setProject(null);
    } else {
      setProject(result.project);
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadProject();
  }, [projectId, user?.id]);

  const paid = project?.status === 'paid';
  const estimate = useMemo(() => (project ? paidEstimate(project) : null), [project]);
  const comparisons = useMemo(
    () => (estimate ? constructionCostService.compareQualityLevels(estimate.specs) : []),
    [estimate]
  );

  const handleUnlocked = () => {
    setShowAccountPrompt(!user);
    void loadProject();
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-paper-100 text-ink-600 font-display">
        Loading project…
      </div>
    );
  }

  if (error || !project) {
    return (
      <ToolShell
        meta={{
          title: 'Project not found — DirectHome',
          description: 'Construction estimate project',
          path: '/construction-estimator',
        }}
        eyebrow="Build estimates"
        heroTitle="Project not found"
        heroSubtitle={error || 'This estimate could not be loaded.'}
        heroImage={plateBuild}
      >
        <div className="text-center py-12">
          <Link
            to="/construction-estimator"
            className="inline-block px-6 py-3 bg-courtyard-700 text-paper-50 font-semibold hover:bg-courtyard-600"
          >
            Start a new estimate
          </Link>
        </div>
      </ToolShell>
    );
  }

  const buildingLabel = project.specs.buildingType
    ? BUILDING_LABELS[project.specs.buildingType]
    : 'building';
  const city = project.specs.location?.city || project.specs.location?.state || 'Nigeria';
  const sqm = project.specs.totalSquareMeters;

  return (
    <ToolShell
      meta={{
        title: `${project.title} — Construction Estimate`,
        description: 'Your saved construction cost estimate for Nigeria.',
        path: projectRoute(project.id),
      }}
      eyebrow={paid ? 'Paid project' : '₦399 to unlock'}
      heroTitle={project.title}
      heroSubtitle={
        paid
          ? 'Full bill of quantities, labour, staged cash plan, and PDF export.'
          : 'Your estimate is ready. Pay once to unlock the totals, BOQ, and PDF for this build.'
      }
      heroImage={plateBuild}
      faq={PROJECT_FAQ}
    >
      {showAccountPrompt && !user && (
        <div className="mb-6 border border-courtyard-700/30 bg-courtyard-50 p-4 md:p-5">
          <p className="font-display text-lg font-semibold text-ink-950 mb-1">Save this to your profile</p>
          <p className="text-sm text-ink-600 mb-3">
            Create a free DirectHome account with the same email you used at checkout to access this
            project anytime from your profile.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/auth/register?redirect=${encodeURIComponent(projectRoute(project.id))}`}
              className="px-4 py-2 bg-courtyard-700 text-paper-50 text-sm font-semibold hover:bg-courtyard-600"
            >
              Create account
            </Link>
            <Link
              to={`/auth/login?redirect=${encodeURIComponent(projectRoute(project.id))}`}
              className="px-4 py-2 border border-paper-300 text-ink-800 text-sm hover:bg-paper-100"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}

      {paid && estimate ? (
        <EstimatorReport estimate={estimate} comparisons={comparisons} />
      ) : (
        <ResultPaywall
          toolId="construction-estimator"
          projectId={project.id}
          title="Unlock your construction estimate"
          description={
            <>
              Your {buildingLabel.toLowerCase()} in {city}
              {sqm ? ` (${sqm} sqm)` : ''} is saved. Pay{' '}
              <span className="text-courtyard-700 font-semibold">₦399</span> to unlock the total,
              bill of quantities, labour, cash calendar, and PDF. Totals are not shown until this
              project is paid. Each new build is a separate project.
            </>
          }
          onUnlocked={handleUnlocked}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
        <button
          type="button"
          onClick={() => navigate('/construction-estimator')}
          className="px-6 py-2.5 min-h-11 border border-paper-300 text-ink-800 hover:bg-paper-100"
        >
          New build project
        </button>
        {user && (
          <Link
            to="/profile"
            className="px-6 py-2.5 min-h-11 border border-paper-300 text-ink-800 hover:bg-paper-100 text-center"
          >
            My build estimates
          </Link>
        )}
      </div>
    </ToolShell>
  );
};

export default ConstructionProjectPage;
