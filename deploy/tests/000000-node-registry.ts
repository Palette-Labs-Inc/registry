import { expect } from 'chai';
import { NodeRegistry } from '../../components/Contracts';
import { describeDeployment } from '../../test/helpers/Deploy';
import { DeployedContracts } from '../../utils/Deploy';

describeDeployment(__filename, () => {
  let registry: NodeRegistry;

  beforeEach(async () => {
    registry = await DeployedContracts.NodeRegistry.deployed();
  });

  it('should deploy the node registry', async () => {
    expect(await registry.version()).to.equal('0.0.1');
  });
});
