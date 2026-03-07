'use client';

import { CopyIcon, LightningBoltIcon } from '@radix-ui/react-icons';
import {
  Box,
  Callout,
  Flex,
  IconButton,
  TextArea,
  Tooltip,
} from '@radix-ui/themes';
import { useEffect, useRef, useState } from 'react';

type Attribute = {
  name: string;
  description: string;
};

type ThemeGroup = {
  theme: string;
  attributes: Attribute[];
};

interface SmartGoalsPromptProps {
  levelKey: string;
  levelName: string;
  themeGroups: ThemeGroup[];
}

const buildPrompt = (
  levelKey: string,
  levelName: string,
  themeGroups: ThemeGroup[],
): string => {
  const isIC = levelKey.startsWith('P');
  const track = isIC ? 'Software Engineer (IC)' : 'Engineering Manager (EM)';
  const themeList = themeGroups
    .map(({ theme, attributes }) => {
      const attrs = attributes
        .map(({ name, description }) => `  - ${name}: ${description}`)
        .join('\n');
      return `- ${theme}:\n${attrs}`;
    })
    .join('\n');

  return `You are a career coach helping an engineer build SMART goals scoped to a single quarter. Be direct and honest, but stay supportive and non-judgmental — career growth conversations can be sensitive.

## Engineer Context
- Target level: ${levelKey} — ${levelName}
- Track: ${track}
- Note: This is the level the engineer is working toward being promoted to, not their current level. The attribute descriptions below reflect the expectations they need to consistently demonstrate to achieve that promotion.
- Opportunity themes and attributes identified:
${themeList}

## Interview
For each opportunity theme, reference the specific attributes and their descriptions above. Ask the engineer to describe a real-world situation where they fell short of or struggled with those specific expectations. Keep the conversation strictly anchored to the listed attributes — do not broaden it to general growth areas or existing strengths.

Ask follow-up questions based on the engineer's responses, with the goal of understanding which specific gaps are most impactful and actionable to build a goal around. Examples of useful probes (use your judgment based on what is said):
- Where specifically did you find it difficult to meet this expectation?
- How often does this situation arise?
- What does meeting this expectation fully look like to you?
- What blockers have prevented progress so far?

Work through themes one at a time. Don't move on until you have enough to propose a meaningful goal.

## Goal proposals
Based on the interview, propose 2–3 SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) scoped to a single quarter. Each goal must directly address one of the listed opportunity attributes — do not suggest goals outside those areas.

## Refinement
Ask which goal(s) resonate most. Offer to fine-tune wording, adjust scope, or make goals more concrete. If any opportunity themes haven't been addressed, invite the engineer to describe a scenario for those as well. Push back if any goal drifts outside the identified opportunity attributes.

Pay close attention to the combined effort of the full goal set. A goal that is attainable in isolation may become unattainable alongside 3–4 others. As the set grows or becomes more ambitious, evaluate whether the total effort is realistic for a single quarter. If the cumulative load looks too great, say so directly and suggest reducing scope, deferring a goal, or simplifying one or more to bring the set back into reach.

## Final output
Once the engineer is satisfied, produce a clean list of agreed SMART goals formatted with their theme label. Do not output this until the engineer confirms they are done.`.trim();
};

type CopyState = 'idle' | 'copied' | 'error';

const COPY_TOOLTIP: Record<CopyState, string> = {
  idle: 'Copy prompt',
  copied: 'Copied!',
  error: 'Copy failed — select text manually',
};

const SmartGoalsPrompt = ({
  levelKey,
  levelName,
  themeGroups,
}: SmartGoalsPromptProps) => {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prompt = buildPrompt(levelKey, levelName, themeGroups);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);

    if (!navigator.clipboard) {
      console.error(
        '[SmartGoalsPrompt] navigator.clipboard unavailable — insecure context or unsupported browser.',
      );
      setCopyState('error');
      timeoutRef.current = setTimeout(() => setCopyState('idle'), 3000);
      return;
    }

    try {
      await navigator.clipboard.writeText(prompt);
      setCopyState('copied');
      timeoutRef.current = setTimeout(() => setCopyState('idle'), 2000);
    } catch (err) {
      console.error('[SmartGoalsPrompt] Failed to write to clipboard.', err);
      setCopyState('error');
      timeoutRef.current = setTimeout(() => setCopyState('idle'), 3000);
    }
  };

  return (
    <Flex direction='column' gap='2'>
      <Flex align='center' justify='between'>
        <Box flexGrow='1' mr='2'>
          <Callout.Root>
            <Callout.Icon>
              <LightningBoltIcon />
            </Callout.Icon>
            <Callout.Text>
              Paste into any LLM to build SMART goals from your opportunities.
            </Callout.Text>
          </Callout.Root>
        </Box>
        <Tooltip content={COPY_TOOLTIP[copyState]}>
          <IconButton
            variant='surface'
            size='2'
            aria-label={COPY_TOOLTIP[copyState]}
            onClick={handleCopy}
          >
            <CopyIcon />
          </IconButton>
        </Tooltip>
      </Flex>
      <TextArea
        value={prompt}
        readOnly
        resize='vertical'
        rows={12}
        variant='surface'
      />
    </Flex>
  );
};

export default SmartGoalsPrompt;
