'use client';

import React from 'react';
import styled from '@emotion/styled';
import { Flex } from '@chakra-ui/react';

// Types remain the same as before
interface ITag {
    id: string;
    name: string;
}

interface Prospect {
    id: string;
    logo: string;
    name: string;
    location?: string;
    tags: ITag[];
    date: string;
    product: string;
    users: number;
    budget: number;
    duration: string;
    resources: number;
}

interface Project {
    id: string;
    logo: string;
    name: string;
    tags: ITag[];
    phase: string;
    date: string;
    product: string;
    budget: number;
    duration: string;
    progress: number;
}

interface Metrics {
    totalProspects: number;
    totalProjects: number;
    revenue: number;
    pipeline: number;
    hoursSaved: number;
    satisfaction: number;
}

interface DashboardData {
    prospects: Prospect[];
    projects: Project[];
    metrics: Metrics;
}

// Styled Components
const Container = styled.div`
  margin: 0 auto;
  padding: 1.5rem;
  padding-left: 22vw;
  display: grid;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.5);
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const Logo = styled.img`
  height: 30px;
  max-width: 100px;
  object-fit: contain;
  margin-right: 0.75rem;
`;

const CompanyInfo = styled.div`
  h3 {
    font-weight: bold;
    font-size: 0.875rem;
    margin: 0;
  }
  
  p {
    font-size: 0.75rem;
    color: #666;
    margin: 0;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
`;

const Tag = styled.span`
  background: #f3f0ff;
  color: #6b46c1;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
`;

const MetricValue = styled.div`
  color: #6b46c1;
  font-weight: bold;
  font-size: 1.125rem;
`;

const MetricLabel = styled.div`
  color: #666;
  font-size: 0.875rem;
`;

const GridStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 0.5rem;
  background: #e2e8f0;
  border-radius: 0.25rem;
  margin-bottom: 0.75rem;
  
  &:after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: #48bb78;
    border-radius: 0.25rem;
    transition: width 0.3s ease;
  }
`;

const SectionTitle = styled.h2`
  color: #6b46c1;
  font-size: 1.125rem;
  margin-bottom: 1rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

// Component implementations
const ProspectCard = ({ prospect }: { prospect: Prospect }) => (
    <Card>
        <CardHeader>
            <Logo src={prospect.logo} alt={prospect.name} />
            <CompanyInfo>
                <h3>{prospect.name}</h3>
                {prospect.location && <p>{prospect.location}</p>}
            </CompanyInfo>
        </CardHeader>

        <TagContainer>
            {prospect.tags.map((tag, i) => (
                <Tag key={i}>{tag.name}</Tag>
            ))}
        </TagContainer>

        <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
            Proposal Generated: {prospect.date}
        </p>
        <p style={{ fontSize: '0.75rem', color: '#3182ce', marginBottom: '0.75rem' }}>
            {prospect.product}
        </p>

        <GridStats>
            <div>
                <MetricValue>{prospect.users} Users</MetricValue>
                <MetricValue>${prospect.budget.toLocaleString()}</MetricValue>
            </div>
            <div>
                <MetricLabel>{prospect.duration}</MetricLabel>
                <MetricLabel>{prospect.resources} Resources</MetricLabel>
            </div>
        </GridStats>
    </Card>
);

const ProjectCard = ({ project }: { project: Project }) => (
    <Card>
        <CardHeader>
            <Logo src={project.logo} alt={project.name} />
            <CompanyInfo>
                <h3>{project.name}</h3>
            </CompanyInfo>
        </CardHeader>

        <TagContainer>
            {project.tags.map((tag, i) => (
                <Tag key={i}>{tag.name}</Tag>
            ))}
        </TagContainer>

        <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>
            {project.phase}
        </p>
        <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
            {project.date}
        </p>
        <p style={{ fontSize: '0.75rem', color: '#3182ce', marginBottom: '0.75rem' }}>
            {project.product}
        </p>

        <ProgressBar progress={project.progress} />

        <GridStats>
            <div>
                <MetricValue>${project.budget.toLocaleString()}</MetricValue>
            </div>
            <div>
                <MetricLabel>{project.duration}</MetricLabel>
            </div>
        </GridStats>
    </Card>
);

const MetricCard = ({ label, value }: { label: string; value: string | number }) => (
    <Card>
        <MetricValue style={{ fontSize: '1.875rem' }}>{value}</MetricValue>
        <MetricLabel>{label}</MetricLabel>
    </Card>
);

const Prospects = () => {
    // Sample data remains the same as in your original code
    const data: DashboardData = {
        prospects: [
            {
                id: '1',
                logo: '/img/daimlertruck.svg',
                name: 'DAIMLER TRUCK',
                location: 'North America',
                tags: [
                    { id: '1', name: 'Manufacturing' },
                    { id: '2', name: 'Electric' },
                    { id: '3', name: 'Americas' },
                    { id: '4', name: 'Medium' }
                ],
                date: 'Sep 29th 2024',
                product: 'Dynamics 365 Finance',
                users: 145,
                budget: 665000,
                duration: '6 months',
                resources: 4
            },
        ],
        projects: [
            {
                id: '1',
                logo: '/img/mizkan-logo.webp',
                name: 'mizkan',
                tags: [
                    { id: '1', name: 'Manufacturing' },
                    { id: '2', name: 'Process' },
                    { id: '3', name: 'Americas' },
                    { id: '4', name: 'Complex' }
                ],
                phase: 'Solution Validation',
                date: 'October 15th 2024',
                product: 'Dynamics 365 Finance & Supply Chain',
                budget: 1760000,
                duration: '9 months',
                progress: 75
            },
        ],
        metrics: {
            totalProspects: 56,
            totalProjects: 21,
            revenue: 23000000,
            pipeline: 47000000,
            hoursSaved: 18000,
            satisfaction: 85
        }
    };

    return (
        <Flex
            w="100%"
            pt={{ base: '70px', md: '0px' }}
            direction="column"
            position="relative"
        >
            <Flex
                direction="column"
                mx="auto"
                w={{ base: '100%', md: '100%', xl: '100%' }}
                minH={{ base: '75vh', '2xl': '85vh' }}
            >
                <Container>
                    <div>
                        <SectionTitle>Active Prospects</SectionTitle>
                        {data.prospects.map((prospect, i) => (
                            <ProspectCard key={i} prospect={prospect} />
                        ))}
                    </div>

                    <div>
                        <SectionTitle>Active Projects</SectionTitle>
                        {data.projects.map((project, i) => (
                            <ProjectCard key={i} project={project} />
                        ))}
                    </div>

                    <div>
                        <SectionTitle>Impact</SectionTitle>
                        <MetricsGrid>
                            <MetricCard
                                label="Total Prospects"
                                value={data.metrics.totalProspects}
                            />
                            <MetricCard
                                label="Revenue"
                                value={`$${data.metrics.revenue / 1000000}M`}
                            />
                            <MetricCard
                                label="Total Projects"
                                value={data.metrics.totalProjects}
                            />
                            <MetricCard
                                label="Pipeline"
                                value={`$${data.metrics.pipeline / 1000000}M`}
                            />
                            <MetricCard
                                label="Hours Saved"
                                value={data.metrics.hoursSaved.toLocaleString()}
                            />
                            <MetricCard
                                label="Customer Satisfaction"
                                value={`${data.metrics.satisfaction}%`}
                            />
                        </MetricsGrid>
                    </div>
                </Container>
            </Flex>
        </Flex>
    );
};

export default Prospects;