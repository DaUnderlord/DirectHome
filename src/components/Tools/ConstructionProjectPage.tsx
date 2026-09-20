import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  fetchConstructionProject,
  loadPreviewCache,
  projectRoute,
  savePreviewCache,
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
      'Your first estimate on this device is free to view. Downloading the PDF, and every extra build after that, is ₦399 per project.',
  },
  {
    question: 'Can I access this later?',
    answer:
      'Yes. Paid projects are saved to your DirectHome profile. Guest buyers can create an account with the same email to claim their projects.',
  },
];

function hasFullSpecs(specs?: ConstructionProjectSummary['specs'] | ConstructionSpecs | null) {
  return Boolean(
    specs &&
      'buildingType' in specs &&
      specs.buildingType &&
      specs.totalSquareMeters &&
      'features' in specs &&
      specs.features &&
      'location' in specs &&
      specs.location &&
      'tier' in specs.location
  );
}

function visibleEstimate(
  project: ConstructionProjectSummary,
  localSpecs: ConstructionSpecs | null
): ConstructionEstimate | null {
  const paid = project.status === 'paid';
  const preview = Boolean(project.preview_granted) || Boolean(localSpecs);
  if (!paid && !preview) return null;

  if (project.estimate && Number(project.estimate.grandTotal) > 0) {
    return project.estimate;
  }

  const specs = (hasFullSpecs(localSpecs) ? localSpecs : project.specs) as ConstructionSpecs | null;
  if (!hasFullSpecs(specs)) return null;
  try {
    return constructionCostService.calculateEstimate(specs as ConstructionSpecs);
  } catch {
    return null;
  }
}

type ProjectLocationState = {
  specs?: ConstructionSpecs;
  freePreview?: boolean;
};

const ConstructionProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const navState = (location.state || {}) as ProjectLocationState;

  const [localSpecs] = useState<ConstructionSpecs | null>(() => {
    if (navState.specs && projectId) {
      savePreviewCache(projectId, navState.specs);
      return navState.specs;
    }
    return projectId ? loadPreviewCache(projectId) : null;
  });
  const [freePreview] = useState(() => Boolean(navState.freePreview) || Boolean(localSpecs));

  const [project, setProject] = useState<ConstructionProjectSummary | null>(() => {
    if (!projectId || !localSpecs || !freePreview) return null;
    return {
      id: projectId,
      title: 'Your construction estimate',
      status: 'awaiting_payment',
      created_at: new Date().toISOString(),
      preview_granted: true,
      specs: localSpecs,
    };
  });
  const [loading, setLoading] = useState(!project);
  const [error, setError] = useState<string | null>(null);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [showPdfPaywall, setShowPdfPaywall] = useState(false);

  const loadProject = async () => {
    if (!projectId) return;
    if (!freePreview) setLoading(true);
    setError(null);
    const result = await fetchConstructionProject({ projectId });
    if (!result.ok || !result.project) {
      if (!freePreview) {
        setError(result.error || 'Project not found.');
        setProject(null);
      }
    } else {
      const incoming = result.project;
      const keepLocalSpecs =
        Boolean(localSpecs) &&
        (freePreview || Boolean(incoming.preview_granted)) &&
        !hasFullSpecs(incoming.specs);
      setProject({
        ...incoming,
        preview_granted: Boolean(incoming.preview_granted) || freePreview,
        specs: keepLocalSpecs && localSpecs ? localSpecs : incoming.specs,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadProject();
  }, [projectId, user?.id]);

  const paid = project?.status === 'paid';
  const estimate = useMemo(
    () => (project ? visibleEstimate(project, freePreview ? localSpecs : null) : null),
    [project, localSpecs, freePreview]
  );
  const comparisons = useMemo(
    () => (estimate ? constructionCostService.compareQualityLevels(estimate.specs) : []),
    [estimate]
  );

  const handleUnlocked = () => {
    setShowAccountPrompt(!user);
    setShowPdfPaywall(false);
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
  const preview =
    Boolean(project.preview_granted) || Boolean(freePreview && localSpecs && estimate);
  const canView = Boolean(paid || (preview && estimate));

  return (
    <ToolShell
      meta={{
        title: `${project.title} — Construction Estimate`,
        description: 'Your saved construction cost estimate for Nigeria.',
        path: projectRoute(project.id),
      }}
      eyebrow={paid ? 'Paid project' : preview ? 'Free preview' : '₦399 to unlock'}
      heroTitle={project.title}
      heroSubtitle={
        paid
          ? 'Full bill of quantities, labour, staged cash plan, and PDF export.'
          : preview
            ? 'Your first estimate is free to view. Pay ₦399 to download the PDF for this build.'
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

      {canView && estimate ? (
        <EstimatorReport
          estimate={estimate}
          comparisons={comparisons}
          pdfLocked={!paid}
          onRequestPdf={() => setShowPdfPaywall(true)}
        />
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
              bill of quantities, labour, cash calendar, and PDF. Each new build after your first
              free preview is a separate project.
            </>
          }
          onUnlocked={handleUnlocked}
        />
      )}

      {canView && !paid && showPdfPaywall && (
        <ResultPaywall
          toolId="construction-estimator"
          projectId={project.id}
          title="Download the PDF report"
          description={
            <>
              The on-screen estimate is free this first time. Pay{' '}
              <span className="text-courtyard-700 font-semibold">₦399</span> to download the
              print-ready PDF for this build.
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
