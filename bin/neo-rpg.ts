#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NeoRpgStack } from '../lib/neo-rpg-stack';

const app = new cdk.App();
new NeoRpgStack(app, 'NeoRpgStack');
