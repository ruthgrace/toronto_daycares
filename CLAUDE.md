# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Toronto daycare search website that embeds the toronto.ca child care locator (https://www.toronto.ca/community-people/children-parenting/children-programs-activities/licensed-child-care/child-care-locator/) and enhances it with additional functionality.

## Core Features

### Current/Planned Features
- Embed the toronto.ca daycare/preschool search interface
- Allow users to add schools to their interested lists
- Enable rearranging the order of interested schools
- Future: Add timestamped notes functionality
- Future: View notes history
- Future: Mark waitlist vs accepted status

## Repository Information

- **Main branch**: `main`
- **Remote**: `git@github.com:ruthgrace/toronto_daycares.git`

## Development Notes

This is a greenfield project. When implementing:
- Consider using a modern web framework suitable for embedding external content
- Ensure proper iframe sandboxing if embedding the toronto.ca site
- Plan for user data persistence (interested lists, notes, status tracking)
- Consider authentication/user management for personalized lists
